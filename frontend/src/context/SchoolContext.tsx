"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Orbit, BookOpen, Layers, Cpu, Gavel } from "lucide-react";

export type School = {
  id: string;
  name: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  accent: string;
  description: string;
};

export const SCHOOLS: School[] = [
  { 
    id: "atlas", 
    name: "Atlas Global", 
    icon: Orbit, 
    color: "text-indigo-500", 
    bg: "bg-indigo-500/10", 
    border: "border-indigo-500/20",
    accent: "indigo",
    description: "Multi-School Institutional Pulse"
  },
  { 
    id: "isme", 
    name: "ISME Business", 
    icon: BookOpen, 
    color: "text-indigo-600", 
    bg: "bg-indigo-600/10", 
    border: "border-indigo-600/20",
    accent: "indigo",
    description: "Management & Finance Command"
  },
  { 
    id: "isdi", 
    name: "ISDI Design", 
    icon: Layers, 
    color: "text-pink-600", 
    bg: "bg-pink-600/10", 
    border: "border-pink-600/20",
    accent: "pink",
    description: "Innovation & Design Ecosystem"
  },
  { 
    id: "ugdx", 
    name: "uGDX Tech", 
    icon: Cpu, 
    color: "text-cyan-600", 
    bg: "bg-cyan-600/10", 
    border: "border-cyan-600/20",
    accent: "cyan",
    description: "Emerging Tech & AI Engineering"
  },
  { 
    id: "law", 
    name: "Law & Policy", 
    icon: Gavel, 
    color: "text-amber-600", 
    bg: "bg-amber-600/10", 
    border: "border-amber-600/20",
    accent: "amber",
    description: "Jurisprudence & AI Policy"
  },
];

type SchoolContextType = {
  currentSchool: School;
  setSchool: (id: string) => void;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [currentSchool, setCurrentSchool] = useState<School>(SCHOOLS[0]);

  const setSchool = (id: string) => {
    const school = SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
    setCurrentSchool(school);
    localStorage.setItem("atlas_active_school", id);
  };

  useEffect(() => {
    const saved = localStorage.getItem("atlas_active_school");
    if (saved) {
      const school = SCHOOLS.find((s) => s.id === saved);
      if (school) setCurrentSchool(school);
    }
  }, []);

  return (
    <SchoolContext.Provider value={{ currentSchool, setSchool }}>
      <div className={`atlas-theme-${currentSchool.accent}`}>
        {children}
      </div>
    </SchoolContext.Provider>
  );
}

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
};
