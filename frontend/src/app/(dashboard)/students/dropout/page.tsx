"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function DropoutPredictorPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Dropout Predictor",
        agentId: "students-dropout",
        badge: "unique",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#ec4899",
        tagline: "Predict risk 6 weeks early - intervene proactively.",
        description:
          "The Dropout Predictor analyzes behavioral patterns, academic performance trends, and engagement metrics to identify students at risk of attrition. It surfaces high-risk cases with a breakdown of triggers, allowing counselors to intervene while there is still time to course-correct.",
        stats: [
          { label: "Students Tracked", value: "4,285", change: "Full campus", up: true },
          { label: "High Risk Flags", value: "32", change: "Requires attention", up: false },
          { label: "Stabilized Cases", value: "124", change: "Prev 90 days", up: true },
          { label: "Prediction Accuracy", value: "89%", change: "vs Last sem hist.", up: true },
        ],
        pipeline: [
          { title: "Engagement Audit", desc: "Checks LMS activity, attendance trends, and library logins" },
          { title: "Academic Benchmarking", desc: "Compares current internals with historical semester averages" },
          { title: "Sentiment Triage", desc: "Optional: Analyzes feedback or support tickets for distress signals" },
          { title: "Correlation Mapping", desc: "Links triggers (e.g., fee delay) to historical dropout outcomes" },
          { title: "Intervention Routing", desc: "Assigns high-risk profiles to department counselors with summary" },
        ],
        actions: [
          { label: "Run Prediction", desc: "Calculate risk scores across all students using weighted behavioral signals" },
          { label: "Intervention Plan", desc: "Generate evidence summaries and step-by-step actions for at-risk students" },
          { label: "Early Warning", desc: "List students who crossed into high-risk tiers in the last 7 days" },
          { label: "Trend Analysis", desc: "Analyse semester-long engagement slopes for pattern identification" },
        ],
        activity: [
          { time: "Just now", event: "Aman Bansal flagged as High Risk (88%) — Attendance drop", status: "error" },
          { time: "18m ago",  event: "Sameer Sheikh intervention ongoing — Counselor assigned", status: "pending" },
          { time: "45m ago",  event: "Sneha Rao status updated to 'Stabilized' — Grades improving", status: "success" },
          { time: "2h ago",   event: "Bulk risk scan completed for Semester 2 (Mechanical)", status: "success" },
          { time: "4h ago",   event: "LMS engagement anomaly detected for 12 students in IT", status: "pending" },
        ],
        capabilities: [
          "Behavioral pattern analysis",
          "Academic performance alerting",
          "Engagement trend monitoring",
          "Historical dropout correlation",
          "Automated intervention workflow",
          "Counselor assignment & tracking",
          "Yield management integration",
          "Predictive sentiment analysis",
        ],
      }}
    />
  );
}
