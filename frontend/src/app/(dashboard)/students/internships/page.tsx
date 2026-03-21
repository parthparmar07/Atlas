"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function StudentInternshipsPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Internships Engine",
        agentId: "students-internships",
        badge: "hot",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#0284c7",
        tagline: "Match the right student to the right role at scale.",
        description:
          "Runs internship matching, partner onboarding, progress reporting, and template generation with actionable fit signals and readiness visibility.",
        stats: [
          { label: "Eligible Students", value: "612", change: "Current placement cycle" },
          { label: "Partner Companies", value: "89", change: "Active collaborations", up: true },
          { label: "High Fit Matches", value: "146", change: "Above threshold score", up: true },
          { label: "At-Risk Internships", value: "18", change: "Needs intervention", up: false },
        ],
        pipeline: [
          { title: "Profile Intake", desc: "Gather student skills, preferences, and constraints" },
          { title: "Role Matching", desc: "Score fit across partner role pools" },
          { title: "Partner Workflow", desc: "Manage partner onboarding and templates" },
          { title: "Progress Monitoring", desc: "Track ongoing internship outcomes" },
          { title: "Compliance Pack", desc: "Generate monthly reporting artifacts" },
        ],
        actions: [
          { label: "Match Now", desc: "Run student-to-role match scoring" },
          { label: "Add Partner", desc: "Onboard a new internship partner profile" },
          { label: "Monthly Reports", desc: "Produce monthly internship health report" },
          { label: "Template Library", desc: "Generate standard internship templates" },
        ],
        activity: [
          { time: "Now", event: "Batch match run completed for Data and Design cohorts", status: "success" },
          { time: "9m ago", event: "New partner onboarding draft generated", status: "success" },
          { time: "22m ago", event: "Monthly report flagged 4 internship risk cases", status: "pending" },
          { time: "43m ago", event: "Template pack refreshed for final evaluation cycle", status: "info" },
          { time: "1h ago", event: "Placement desk sync completed", status: "success" },
        ],
        capabilities: [
          "Student-role fit scoring",
          "Partner profile onboarding",
          "Internship risk monitoring",
          "Monthly reporting",
          "Template generation",
          "Placement desk handoff",
          "Ops action timeline",
          "Communication retries",
        ],
      }}
    />
  );
}
