import { Bell, Search, Moon, ChevronDown, Zap, Mic, MicOff, AudioLines, Navigation, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  onOpenAIManager?: () => void;
}

import { useSchool } from "@/context/SchoolContext";

export default function Header({ onOpenAIManager }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { currentSchool } = useSchool();
  const router = useRouter();

  // Voice Commander State
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setLoadingVoice(true);
        try {
          const data = await api<any>(`/api/academics/voice-action`, {
            method: "POST",
            body: JSON.stringify({ text })
          });
          setVoiceResult(data);
          if (data.action === "NAVIGATE") {
            router.push(data.path);
          }
        } catch (e) {
          console.error("Voice processing failed", e);
        } finally {
          setLoadingVoice(false);
          setTimeout(() => setVoiceResult(null), 3000);
        }
      };
      recognitionRef.current = recognition;
    }
  }, [router]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setVoiceResult(null);
      recognitionRef.current?.start();
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-50 shrink-0 sticky top-0 shadow-sm transition-all duration-500">
      
      {/* Search & Actions Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className={cn(
          "relative flex items-center transition-all duration-300 rounded-full overflow-hidden border max-w-xl flex-1 bg-slate-50",
          isSearchFocused ? "border-indigo-300 shadow-[0_0_0_2px_rgba(99,102,241,0.1)] bg-white" : "border-slate-200 hover:border-slate-300"
        )}>
          <div className="pl-4 pr-2 text-slate-400 flex shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder={`Search ${currentSchool.name} agents...`} 
            className="w-full bg-transparent border-none py-2.5 px-2 text-sm outline-none placeholder:text-slate-400 text-slate-800"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          
          {/* Global Voice Toggle */}
          <button 
            onClick={toggleListening}
            className={cn(
              "p-2 rounded-full mx-1 transition-all flex items-center justify-center relative",
              isListening ? "bg-rose-100 text-rose-600 scale-110" : "text-slate-400 hover:bg-slate-200"
            )}
            title="Global Voice AI"
          >
            {isListening ? (
              <>
                <AudioLines className="w-4 h-4 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenAIManager}
            className="flex items-center gap-2 m-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs font-black rounded-full mr-1 tracking-wide shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" /> AI MANAGER
          </button>
        </div>

        {/* Voice Processing Visual Indicator */}
        {(loadingVoice || voiceResult) && (
          <div className="px-5 py-2.5 bg-slate-900 border border-white/10 rounded-2xl flex items-center gap-4 animate-in slide-in-from-left-8 duration-500 shadow-2xl">
            {loadingVoice ? (
              <Zap className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : voiceResult?.action === "NAVIGATE" ? (
              <Navigation className="w-4 h-4 text-emerald-400" />
            ) : (
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            )}
            <div className="flex flex-col leading-none gap-1">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">AI VOICE COMMANDER</span>
              <span className="text-xs font-bold text-white tracking-tight">{loadingVoice ? "Synthesizing Request..." : voiceResult?.message}</span>
            </div>
          </div>
        )}

        {/* Global School context indicator in Header */}
        <div className={cn("hidden lg:flex items-center gap-3 px-4 py-2 rounded-full border transition-all animate-in slide-in-from-left-4", currentSchool.bg, currentSchool.border)}>
          <currentSchool.icon className={cn("w-4 h-4", currentSchool.color)} />
          <div className="flex flex-col leading-none">
            <span className={cn("text-[9px] font-black uppercase tracking-widest opacity-60", currentSchool.color)}>{currentSchool.name}</span>
            <span className={cn("text-[10px] font-black text-slate-900 tracking-tight")}>Institutional Hub</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        
        {/* Action icons */}
        <div className="flex items-center gap-3 text-slate-400">
          <button className="p-2 rounded-full hover:text-indigo-600 hover:bg-slate-100 transition-colors">
            <Moon className="w-5 h-5" />
          </button>
          <button className="relative p-2 rounded-full hover:text-indigo-600 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 transition-transform hover:scale-110" />
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-bounce" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            AD
          </div>
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-sm font-black text-slate-800">Administrator</span>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase italic">Full System Access</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1 group-hover:text-indigo-600 transition-colors" />
        </button>

      </div>
    </header>
  );
}
