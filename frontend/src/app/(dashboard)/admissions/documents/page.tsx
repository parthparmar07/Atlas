import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Document Verifier",
  agentId: "admissions-documents",
  badge: "core",
  domain: "Admissions & Leads",
  domainHref: "/admissions",
  domainColor: "#f97316",
  tagline: "Zero document errors reach the counsellor's desk.",
  description:
    "Reads every uploaded mark sheet, certificate, and ID proof the moment it's submitted. Flags missing documents, format mismatches, and data inconsistencies before the counsellor ever opens the file.",
  stats: [
    { label: "Docs Verified Today", value: "341",   change: "+12% from yesterday", up: true },
    { label: "Error Rate Found",    value: "18%",   change: "Of uploads have issues" },
    { label: "Avg Verify Time",     value: "3.2s",  change: "Per document" },
    { label: "Manual Hours Saved",  value: "47 hrs",change: "This week", up: true },
  ],
  pipeline: [
    { title: "Upload Received", desc: "Student uploads mark sheets, certs, or ID proofs via portal." },
    { title: "AI Document Read", desc: "Gemini Vision parses text, layout, stamps, and signatures." },
    { title: "Completeness Check", desc: "Enforces programme-specific checklist requirements automatically." },
    { title: "Data Validation", desc: "Cross-checks extracted data vs entered scores for inconsistencies." },
    { title: "Result Delivery", desc: "Student and counsellor notified instantly of verification status." },
  ],
  actions: [
    { label: "Verify Batch",      desc: "Run automated verification on latest submissions" },
    { label: "Flag Issues",       desc: "List common document inconsistencies for review" },
    { label: "Generate Checklist", desc: "Create program-specific admission requirements" },
    { label: "Push to ERP",       desc: "Commit verified documents to university records" },
  ],
  activity: [
    { time: "Just now",   event: "10th mark sheet — Ananya Singh: CGPA 9.2 — Verified ✓", status: "success" },
    { time: "8 min ago",  event: "Flagged: Raj Patel — Date mismatch between 10th and 12th certificates", status: "error" },
    { time: "22 min ago", event: "Missing: Transfer certificate for 3 Bangalore applicants — reminders sent", status: "pending" },
    { time: "1 hr ago",   event: "Batch verification complete: 68 documents — 58 passed, 10 flagged", status: "info" },
    { time: "3 hrs ago",  event: "Checklist updated: MBA now requires GMAT/CAT score card", status: "info" },
  ],
  capabilities: [
    "Gemini Vision reads PDFs, images, and scanned docs",
    "Programme-specific document checklist enforcement",
    "CGPA / marks cross-validation with self-declared scores",
    "Signature and stamp presence detection",
    "Automatic student notification with specific error details",
    "Counsellor error queue with one-click review",
    "Audit trail for every document decision",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
