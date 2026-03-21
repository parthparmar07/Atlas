"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function FinanceBudgetPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Budget Monitor",
        agentId: "finance-budget",
        badge: "core",
        domain: "Finance & Governance",
        domainHref: "/finance",
        domainColor: "#2563eb",
        tagline: "Control burn rate before budget risk becomes a governance issue.",
        description:
          "Analyses departmental burn trajectories, detects anomalies, and produces action-ready budget intelligence with structured outputs and trace logs.",
        stats: [
          { label: "Annual Allocation", value: "42.6 Cr", change: "Current FY" },
          { label: "Spent Till Date", value: "28.1 Cr", change: "65.9% utilization" },
          { label: "Warning Lines", value: "9", change: "Needs intervention", up: false },
          { label: "Forecast Accuracy", value: "91%", change: "Last quarter", up: true },
        ],
        pipeline: [
          { title: "Data Intake", desc: "Capture budgets, spends, and transaction streams" },
          { title: "Burn Analysis", desc: "Compute variance and runway signals" },
          { title: "Anomaly Scan", desc: "Detect suspicious or duplicate patterns" },
          { title: "Control Plan", desc: "Recommend corrections by department" },
          { title: "Audit Trail", desc: "Persist all budget actions and evidence" },
        ],
        actions: [
          { label: "Analyze Burn Rate", desc: "Evaluate spend vs allocation and runway" },
          { label: "Detect Anomalies", desc: "Identify unusual or risky transactions" },
        ],
        activity: [
          { time: "Now", event: "Burn analysis completed for Q4 departments", status: "success" },
          { time: "11m ago", event: "2 anomaly clusters detected in procurement-linked spends", status: "pending" },
          { time: "26m ago", event: "Budget control recommendations generated", status: "success" },
          { time: "42m ago", event: "Variance dashboard synced to finance ops", status: "info" },
          { time: "1h ago", event: "Quarterly baseline refreshed", status: "success" },
        ],
        capabilities: [
          "Burn-rate forecasting",
          "Variance analysis",
          "Anomaly detection",
          "Department risk scoring",
          "Control recommendation",
          "Execution telemetry",
          "Audit-safe trail",
          "Ops synchronization",
        ],
      }}
    />
  );
}
