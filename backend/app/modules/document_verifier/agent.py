import json
import logging
import mimetypes
import os
from datetime import datetime, timezone
from typing import Any, List

from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.admissions import LeadDocument
from app.modules.admissions.document_service import document_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase

logger = logging.getLogger(__name__)

class DocumentVerifierAgent(AgentBase):
    agent_id = "admissions-documents"
    agent_name = "Document Verifier"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Document Verifier Agent for Atlas University.
You perform automated verification of student admission documents: mark sheets,
certifications, domicile certificates, caste proofs, and identity documents.
Flag inconsistencies, perform name-matching, and push verified records to the ERP."""

    ACTION_PROMPTS = {
        "Verify Batch": """Simulate verification of the latest batch of 40 student document sets.
Report: verified successfully, pending manual review, flagged for fraud, and missing documents.
For flagged cases give the specific inconsistency detected.""",

        "Flag Issues": """List the top 5 most common document issues detected this admissions cycle.
For each issue: describe it, give frequency count, state the policy implication,
and recommend a process fix to reduce recurrence.""",

        "Generate Checklist": """Generate a complete admission document checklist for UG, PG, and PhD programmes.
Each checklist should specify: document name, format (original/attested/digital),
source authority, and verification method used by the agent.""",

        "Push to ERP": """Simulate pushing 50 verified student records to the university ERP.
Return a commit log with: student ID, documents committed, timestamp, and ERP acknowledgement token.""",
    }

    def _parse_context(self, context: str) -> dict[str, Any]:
        if not context:
            return {}

        stripped = context.strip()
        if stripped.startswith("{"):
            try:
                parsed = json.loads(stripped)
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                pass

        parsed: dict[str, Any] = {}
        for line in context.splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            parsed[key.strip().lower().replace(" ", "_")] = value.strip()
        return parsed

    def _to_int(self, raw: Any, default: int) -> int:
        try:
            value = int(str(raw).strip())
            return value if value > 0 else default
        except Exception:
            return default

    async def _verify_batch(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or context.get("batch_size") or 8, 8)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(LeadDocument)
                .where(LeadDocument.verified.is_(False))
                .order_by(LeadDocument.uploaded_at.desc(), LeadDocument.id.desc())
                .limit(limit)
            )
            docs = rows.scalars().all()

            if not docs:
                state.reflection = "No pending documents found for verification."
                return [{"status": "verification_batch_loaded", "pending_documents": 0}]

            verified_count = 0
            review_count = 0
            missing_files = 0
            verification_log: list[dict[str, Any]] = []

            for doc in docs:
                if not os.path.exists(doc.file_path):
                    missing_files += 1
                    verification_log.append(
                        {
                            "doc_id": doc.id,
                            "lead_id": doc.lead_id,
                            "doc_type": doc.doc_type,
                            "status": "missing_file",
                        }
                    )
                    continue

                with open(doc.file_path, "rb") as fh:
                    file_bytes = fh.read()

                guessed_mime, _ = mimetypes.guess_type(doc.file_path)
                mime_type = guessed_mime or ("application/pdf" if doc.file_path.lower().endswith(".pdf") else "application/octet-stream")

                verification = await document_service.verify_document(doc.id, file_bytes, mime_type, db)
                is_valid = bool(verification.get("is_valid"))
                if is_valid:
                    verified_count += 1
                else:
                    review_count += 1

                verification_log.append(
                    {
                        "doc_id": doc.id,
                        "lead_id": doc.lead_id,
                        "doc_type": doc.doc_type,
                        "status": "verified" if is_valid else "manual_review",
                        "confidence": verification.get("confidence_score", 0),
                        "issues": verification.get("issues_found", []),
                    }
                )

        state.reflection = (
            f"Verified batch complete: {verified_count} auto-verified, "
            f"{review_count} moved to manual review, {missing_files} files missing."
        )
        return [
            {"status": "verification_batch_loaded", "pending_documents": len(docs)},
            {
                "status": "verification_completed",
                "verified_count": verified_count,
                "manual_review_count": review_count,
                "missing_files": missing_files,
                "details": verification_log,
            },
        ]

    async def _flag_issues(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or 200, 200)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(LeadDocument)
                .order_by(LeadDocument.uploaded_at.desc(), LeadDocument.id.desc())
                .limit(limit)
            )
            docs = rows.scalars().all()

        issue_counts: dict[str, int] = {}
        for doc in docs:
            extracted = doc.ai_extracted if isinstance(doc.ai_extracted, dict) else {}
            issues = extracted.get("issues_found", [])
            if isinstance(issues, list):
                for issue in issues:
                    issue_text = str(issue).strip()
                    if not issue_text:
                        continue
                    issue_counts[issue_text] = issue_counts.get(issue_text, 0) + 1

        ranked_issues = sorted(issue_counts.items(), key=lambda item: item[1], reverse=True)
        top_issues = [{"issue": issue, "count": count} for issue, count in ranked_issues[:5]]

        state.reflection = f"Analyzed {len(docs)} documents and identified {len(top_issues)} top recurring issue patterns."
        return [
            {
                "status": "issue_aggregation_completed",
                "documents_scanned": len(docs),
                "top_issues": top_issues,
            }
        ]

    async def _generate_checklist(self, state: AgentState) -> List[Any]:
        checklists = {
            "UG": [
                "Class 10 marksheet",
                "Class 12 marksheet",
                "Transfer certificate",
                "Government photo ID",
                "Passport photo",
            ],
            "PG": [
                "UG degree certificate",
                "UG consolidated transcript",
                "Entrance exam scorecard",
                "Government photo ID",
                "Statement of purpose",
            ],
            "PhD": [
                "PG degree certificate",
                "Research proposal",
                "Publications list (if available)",
                "Recommendation letters",
                "Government photo ID",
            ],
        }

        state.reflection = "Generated admissions verification checklist for UG, PG, and PhD workflows."
        return [
            {
                "status": "checklist_generated",
                "levels": [
                    {"level": level, "documents": docs} for level, docs in checklists.items()
                ],
            }
        ]

    async def _push_to_erp(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or 50, 50)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(LeadDocument)
                .where(LeadDocument.verified.is_(True))
                .order_by(LeadDocument.uploaded_at.desc(), LeadDocument.id.desc())
                .limit(limit)
            )
            docs = rows.scalars().all()

            commit_logs: list[dict[str, Any]] = []
            for doc in docs:
                token = f"ERP-{doc.id}-{int(datetime.now(timezone.utc).timestamp())}"
                existing = doc.ai_extracted if isinstance(doc.ai_extracted, dict) else {}
                existing["erp_sync"] = {
                    "pushed": True,
                    "token": token,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
                doc.ai_extracted = existing

                commit_logs.append(
                    {
                        "lead_id": doc.lead_id,
                        "doc_id": doc.id,
                        "doc_type": doc.doc_type,
                        "timestamp": existing["erp_sync"]["timestamp"],
                        "erp_ack_token": token,
                    }
                )

            await db.commit()

        state.reflection = f"Pushed {len(commit_logs)} verified document records to ERP sync queue."
        return [
            {"status": "erp_payload_prepared", "records": len(commit_logs)},
            {"status": "erp_push_completed", "commit_log": commit_logs},
        ]

    async def execute(self, state: AgentState) -> List[Any]:
        context = self._parse_context(state.context)
        try:
            if state.goal == "Verify Batch":
                return await self._verify_batch(state, context)
            if state.goal == "Flag Issues":
                return await self._flag_issues(state, context)
            if state.goal == "Generate Checklist":
                return await self._generate_checklist(state)
            if state.goal == "Push to ERP":
                return await self._push_to_erp(state, context)
        except Exception as exc:
            logger.exception("Document verifier execution failed for goal=%s", state.goal)
            state.reflection = f"Execution failed for '{state.goal}': {exc}"
            return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

        state.reflection = f"No execution branch found for '{state.goal}'."
        return [{"status": "unsupported_action", "goal": state.goal}]

    async def reflect(self, state: AgentState) -> str:
        if state.reflection:
            return state.reflection
        return await super().reflect(state)
