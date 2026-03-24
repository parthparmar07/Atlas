import { useState } from "react";
import { Building2, FileSearch, BarChart2, Users, BookOpen, Star, FileText, Send, CheckCircle2, LayoutDashboard, Target, Activity } from "lucide-react";

interface PlacementIntelligenceWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function PlacementIntelligenceWorkflow({ onExecute, isExecuting }: PlacementIntelligenceWorkflowProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [batch, setBatch] = useState("B.Tech CSE 2026");
  const [companies, setCompanies] = useState("TCS, Infosys, Wipro, Accenture");
  
  // Local state for specific sub-tools
  const [resumeText, setResumeText] = useState("");
  const [roleFocus, setRoleFocus] = useState("Software Engineer");

  const buildContext = (action: string, requiredOutput: string, extraContext: string = "") => {
    return [
      `Batch: ${batch}`,
      `Target Companies: ${companies}`,
      extraContext,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].filter(Boolean).join("\n");
  };

  const TABS = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "ats", label: "ATS Analyzer", icon: FileSearch },
    { id: "matcher", label: "Role Pipeline", icon: Target },
    { id: "interviews", label: "Mock Interviews", icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
      
      {/* SaaS App Header & Navigation */}
      <div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0 flex flex-col gap-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <Activity className="w-7 h-7 text-emerald-500" />
                  Atlas Placement Operating System
               </h2>
               <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">End-to-End Career Intelligence Suite</p>
            </div>
            <div className="flex gap-4">
               <Input mini label="Active Cohort" value={batch} setValue={setBatch} />
               <Input mini label="Target Scope" value={companies} setValue={setCompanies} />
            </div>
         </div>
         
         <div className="flex gap-6">
            {TABS.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 tracking-tight text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                     activeTab === tab.id 
                     ? "border-emerald-500 text-emerald-600" 
                     : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
               >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
               </button>
            ))}
         </div>
      </div>

      {/* Main Workspace Area */}
      <div className="p-8 flex-1 overflow-y-auto w-full custom-scrollbar">
         {/* Dashboard View */}
         {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/20">
                     <div className="text-[10px] uppercase tracking-widest font-black opacity-70 mb-1">Total Placed</div>
                     <div className="text-4xl font-black tracking-tighter">184<span className="text-lg opacity-60">/250</span></div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20">
                     <div className="text-[10px] uppercase tracking-widest font-black opacity-70 mb-1">Avg. Package</div>
                     <div className="text-4xl font-black tracking-tighter">14.2<span className="text-lg opacity-60"> LPA</span></div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-400 to-orange-500 p-6 rounded-3xl text-white shadow-lg shadow-rose-500/20">
                     <div className="text-[10px] uppercase tracking-widest font-black opacity-70 mb-1">Onboarding Risk</div>
                     <div className="text-4xl font-black tracking-tighter">12<span className="text-lg opacity-60"> Alerts</span></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mt-6">
                  <button 
                     disabled={isExecuting}
                     onClick={() => onExecute("Analyse Batch Skill Gaps", buildContext("Analyse Batch Skill Gaps", "skill-gap report, impact estimate, and workshop plan"))}
                     className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-left flex flex-col items-start gap-4 disabled:opacity-50"
                  >
                     <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><BarChart2 className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Skill Gap Analyzer</h3>
                        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">Scan the entire cohort against live JDs to automatically generate workshop interventions.</p>
                     </div>
                  </button>
                  <button 
                     disabled={isExecuting}
                     onClick={() => onExecute("Manage Company Pipeline", buildContext("Manage Company Pipeline", "pipeline health board, outreach priorities, and risk flags"))}
                     className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-left flex flex-col items-start gap-4 disabled:opacity-50"
                  >
                     <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Building2 className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">CRM & Pipeline Tracker</h3>
                        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">Identify stalled corporate outreach, generate follow-ups, and tier recruitment drives.</p>
                     </div>
                  </button>
               </div>
            </div>
         )}

         {/* ATS Analyzer View */}
         {activeTab === "ats" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-500 flex flex-col h-full shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-rose-50 rounded-2xl text-rose-500"><FileSearch className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Resume & ATS Optimizer</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Check keyword density, impact scores, and rewrite bullets.</p>
                  </div>
               </div>
               
               <div className="flex-1 min-h-[250px] bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                  <textarea 
                     className="w-full h-full bg-transparent resize-none outline-none text-sm text-slate-700 font-medium placeholder-slate-400" 
                     placeholder="Paste student resume contents or bullet points here to analyze..."
                     value={resumeText}
                     onChange={(e) => setResumeText(e.target.value)}
                  />
               </div>

               <div className="flex justify-end">
                  <button 
                     disabled={isExecuting || !resumeText.trim()}
                     onClick={() => onExecute("Review Resume", buildContext("Review Resumes", "resume scorecards, keyword gaps, and bullet rewrites", `Resume Content: ${resumeText}`))}
                     className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-colors flex items-center gap-3 disabled:opacity-50"
                  >
                     Execute ATS Scan <Send className="w-4 h-4"/>
                  </button>
               </div>
            </div>
         )}

         {/* Role Matcher View */}
         {activeTab === "matcher" && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Role Taxonomy Engine</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">Parse live JDs to extract screening weights.</p>
                  
                  <Input label="Target Role Focus" value={roleFocus} setValue={setRoleFocus} />
                  
                  <button 
                     disabled={isExecuting}
                     onClick={() => onExecute("Analyse Job Descriptions", buildContext("Analyse Job Descriptions", "jd analysis matrix, role skill weights", `Focus: ${roleFocus}`))}
                     className="w-full mt-8 bg-indigo-50 text-indigo-600 border border-indigo-100 py-4 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-colors"
                  >
                     Parse Market JD Data
                  </button>
               </div>

               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 pointer-events-none" />
                  <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Student Triangulation</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">Cross-reference records to find optimal candidates.</p>
                  
                  <div className="space-y-3 mb-8 opacity-70 pointer-events-none">
                     <div className="h-6 w-full bg-slate-100 rounded-md" />
                     <div className="h-6 w-3/4 bg-slate-100 rounded-md" />
                     <div className="h-6 w-5/6 bg-slate-100 rounded-md" />
                  </div>

                  <button 
                     disabled={isExecuting}
                     onClick={() => onExecute("Match Students to Jobs", buildContext("Match Students to Jobs", "ranked job matches with score drivers and confidence", `Role Target: ${roleFocus}`))}
                     className="w-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 relative z-10"
                  >
                     <Users className="w-5 h-5"/> Run AI Matchmaker
                  </button>
               </div>
            </div>
         )}

         {/* Mock Interviews View */}
         {activeTab === "interviews" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-between animate-in fade-in slide-in-from-left-8 duration-500 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
               <div className="max-w-md relative z-10">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 w-fit mb-6"><Star className="w-8 h-8"/></div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Hyper-Personalized Mock Engine</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
                     Generate intensive STAR-method technical interview packs tailored exactly to the weakest points of your current student cohort based on recent assessment data.
                  </p>
                  <button 
                     disabled={isExecuting}
                     onClick={() => onExecute("Prepare for Interviews", buildContext("Prepare for Interviews", "question set, answer rubric, and coaching plan"))}
                     className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-colors shadow-xl shadow-slate-900/20"
                  >
                     Generate Interview Packs
                  </button>
               </div>
               
               <div className="hidden lg:flex flex-col gap-4 relative z-10 mr-12">
                  <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 flex items-center gap-3 transform rotate-2">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-bold text-slate-700">System Design Q1 Added</span>
                  </div>
                  <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 flex items-center gap-3 transform -translate-x-6 -rotate-2">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-bold text-slate-700">Behavioral Rubric Active</span>
                  </div>
                  <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 flex items-center gap-3 transform translate-x-4 rotate-1">
                     <CheckCircle2 className="w-5 h-5 text-indigo-500" /> <span className="text-sm font-bold text-slate-700">Code Optimization Round</span>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}

function Input({ label, value, setValue, mini }: { label: string; value: string; setValue: (v: string) => void, mini?: boolean }) {
  return (
    <div className={mini ? "w-48" : "w-full"}>
      <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1.5">{label}</label>
      <input 
         value={value} 
         onChange={(e) => setValue(e.target.value)} 
         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-slate-300" 
      />
    </div>
  );
}
