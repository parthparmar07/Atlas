from app.services.ai.agents.base import AgentBase

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
