"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function StudentCourseBuilderPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Course Builder",
        agentId: "students-course-builder",
        badge: "unique",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#0ea5e9",
        tagline: "Design learner-ready course structure with measurable outcomes.",
        description:
          "Supports outcome-driven course design, resource discovery, and assessment planning with structured input contracts and traceable execution outputs.",
        stats: [
          { label: "Active Course Drafts", value: "34", change: "Across 4 schools" },
          { label: "Outcome Coverage", value: "87%", change: "Mapped to learning goals", up: true },
          { label: "Assessment Gaps", value: "11", change: "Needs rubric tuning", up: false },
          { label: "Resource Match", value: "79%", change: "Topic-aligned references", up: true },
        ],
        pipeline: [
          { title: "Scope Inputs", desc: "Capture course, outcomes, and topics" },
          { title: "Outline Draft", desc: "Generate modular sequence with coverage" },
          { title: "Resource Discovery", desc: "Map curated resources per topic" },
          { title: "Assessment Design", desc: "Draft assessments with learning checks" },
          { title: "Review Pack", desc: "Publish review-ready output summary" },
        ],
        actions: [
          { label: "Design Course Outline", desc: "Generate structured module plan from outcomes" },
          { label: "Find Learning Resources", desc: "Map references and resources by topic" },
          { label: "Create Assessment", desc: "Draft assessment plan and evaluation logic" },
        ],
        activity: [
          { time: "Now", event: "Course outline generated for Applied AI track", status: "success" },
          { time: "11m ago", event: "Resource list refreshed for 3 high-priority topics", status: "success" },
          { time: "27m ago", event: "Assessment draft flagged for rubric completeness", status: "pending" },
          { time: "52m ago", event: "Course review packet synced to ops records", status: "info" },
          { time: "2h ago", event: "Outcome mapping re-run for latest syllabus edits", status: "success" },
        ],
        capabilities: [
          "Outcome-first course drafting",
          "Topic-level resource matching",
          "Assessment plan generation",
          "Coverage gap detection",
          "Review-ready output packaging",
          "Execution trace visibility",
          "Ops timeline persistence",
          "Contract-driven form inputs",
        ],
      }}
    />
  );
}
