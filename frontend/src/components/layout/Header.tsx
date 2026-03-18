"use client";

import { Bell, Search, Moon, ChevronDown, Zap } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  onOpenAIManager?: () => void;
}

export default function Header({ onOpenAIManager }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-20 shrink-0 sticky top-0 shadow-sm">
      
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
            placeholder="Search agents, students, or system logs..." 
            className="w-full bg-transparent border-none py-2.5 px-2 text-sm outline-none placeholder:text-slate-400 text-slate-800"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button
            onClick={onOpenAIManager}
            className="flex items-center gap-2 m-1 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-xs font-bold rounded-full mr-1 tracking-wide shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" /> AI MANAGER
          </button>
        </div>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wide upppercase uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM OPTIMAL
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        
        {/* Action icons */}
        <div className="flex items-center gap-3 text-slate-400">
          <button className="p-2 rounded-full hover:text-indigo-600 hover:bg-slate-100 transition-colors">
            <Moon className="w-5 h-5" />
          </button>
          <button className="relative p-2 rounded-full hover:text-indigo-600 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Separation line */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* User profile */}
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm shrink-0">
            AD
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm font-bold text-slate-800">Admin User</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">SUPER USER</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
        </button>

      </div>
    </header>
  );
}
