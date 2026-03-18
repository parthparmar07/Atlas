"use client";

import { useState } from "react";
import { Play, Settings2, Database, CheckCircle2, Loader2, FileText } from "lucide-react";

interface AdmissionsScoringWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => Promise<void>;
  isExecuting: boolean;
}

export default function AdmissionsScoringWorkflow({ agentId, onExecute, isExecuting }: AdmissionsScoringWorkflowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Data Source
  const [dataSource, setDataSource] = useState<"crm" | "csv">("crm");
  const [batchId, setBatchId] = useState("BATCH-2026-A");
  
  // Step 2: Parameters
  const [academicWeight, setAcademicWeight] = useState(60);
  const [extraWeight, setExtraWeight] = useState(30);
  const [diversityWeight, setDiversityWeight] = useState(10);

  const handleRun = () => {
    const context = `
      Workflow: Run Scoring
      Data Source: ${dataSource === "crm" ? "Live CRM Integration" : "Uploaded CSV"}
      Batch ID: ${batchId}
      
      Scoring Weights:
      - Academic Performance: ${academicWeight}%
      - Extracurriculars: ${extraWeight}%
      - Diversity/Background: ${diversityWeight}%
      
      Instructions: Process the batch using these exact weights. Return a structured JSON array of the top 5 candidates with their calculated composite scores and a brief justification.
    `;
    
    setStep(3);
    onExecute("Run Scoring", context);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Application Scoring Engine</h3>
          <p className="text-sm text-slate-500 mt-1">Multi-variable ML heuristic scoring for incoming batches.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step === 3 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Data Source */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <Database className="w-5 h-5" />
              <h4 className="font-semibold">Step 1: Select Data Source</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setDataSource("crm")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${dataSource === "crm" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="font-bold text-slate-900">Live CRM Sync</div>
                <div className="text-sm text-slate-500 mt-1">Pull latest un-scored applications directly from the admissions portal.</div>
              </button>
              <button 
                onClick={() => setDataSource("csv")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${dataSource === "csv" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="font-bold text-slate-900">CSV Upload</div>
                <div className="text-sm text-slate-500 mt-1">Process a specific offline batch of applications.</div>
              </button>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-slate-700">Target Batch ID</label>
              <input 
                type="text" 
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none font-medium"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Next: Configure Parameters
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Parameters */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <Settings2 className="w-5 h-5" />
              <h4 className="font-semibold">Step 2: Tune Scoring Weights</h4>
            </div>

            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Academic Performance</label>
                  <span className="text-sm font-bold text-indigo-600">{academicWeight}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={academicWeight}
                  onChange={(e) => setAcademicWeight(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Extracurriculars & Leadership</label>
                  <span className="text-sm font-bold text-indigo-600">{extraWeight}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={extraWeight}
                  onChange={(e) => setExtraWeight(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Diversity & Background</label>
                  <span className="text-sm font-bold text-indigo-600">{diversityWeight}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={diversityWeight}
                  onChange={(e) => setDiversityWeight(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              
              {academicWeight + extraWeight + diversityWeight !== 100 && (
                <div className="text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  Warning: Weights should ideally sum to 100%. Current sum: {academicWeight + extraWeight + diversityWeight}%
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleRun}
                disabled={isExecuting}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Execute Scoring Engine
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Execution State */}
        {step === 3 && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
            {isExecuting ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-6">Processing Batch {batchId}...</h3>
                <p className="text-slate-500 mt-2 max-w-md">
                  The AI is currently analyzing applications, applying your custom weights ({academicWeight}/{extraWeight}/{diversityWeight}), and checking for fraud patterns.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Scoring Complete</h3>
                <p className="text-slate-500 mt-2">The batch has been successfully processed.</p>
                <button 
                  onClick={() => setStep(1)}
                  className="mt-8 px-6 py-2.5 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:border-slate-300 transition-colors"
                >
                  Run Another Batch
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
