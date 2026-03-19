import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Course Builder",
  agentId: "students-course-builder",
  badge: "unique",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#ec4899",
  tagline: "Outcome-driven course design and assessment planning.",
  description:
    "Designs course outlines, resource pathways, and assessment matrices aligned with outcomes and practical workload constraints.",
  stats: [
    { label: "Courses Drafted", value: "54", change: "This term" },
    { label: "Outcome Coverage", value: "93%", change: "Average alignment", up: true },
    { label: "Assessment Gaps", value: "6", change: "Flagged for committee" },
    { label: "Resource Packs", value: "212", change: "Topic-mapped" },
  ],
  pipeline: [
    { title: "Outcome Input", desc: "Capture program outcomes and credit boundaries." },
    { title: "Outline Design", desc: "Generate week-wise structure and pedagogy mix." },
    { title: "Resource Mapping", desc: "Attach core and advanced material per topic." },
    { title: "Assessment Matrix", desc: "Build outcome-linked question and rubric distribution." },
  ],
  actions: [
    { label: "Design Course Outline", desc: "Generate implementation-ready course structure" },
    { label: "Find Learning Resources", desc: "Map resources to topics and skill level" },
    { label: "Create Assessment", desc: "Build assessment blueprint and coverage matrix" },
  ],
  activity: [
    { time: "14 min ago", event: "Outcome matrix generated for Data Structures", status: "success" },
    { time: "49 min ago", event: "Assessment imbalance flagged in module-3", status: "pending" },
    { time: "1 hr ago", event: "Resource pack refreshed for ML elective", status: "info" },
  ],
  capabilities: [
    "Outcome-centric course design",
    "Topic-resource linking",
    "Assessment and rubric mapping",
    "Coverage gap detection",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
