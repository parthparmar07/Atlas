"use client";

import { useEffect, useState } from "react";
import { useSchool } from "@/context/SchoolContext";
import { api } from "@/lib/api";
import { UserCheck, Book, Mail, Award, Search, GraduationCap } from "lucide-react";

interface Faculty {
  id: number;
  name: string;
  email: string;
  qualification: string;
  experience: number;
  achievements: string;
  subjects: string[];
}

export default function FacultyTransparencyPage() {
  const { currentSchool } = useSchool();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api<Faculty[]>(`/api/academics/faculty?school=${currentSchool.id}`)
      .then(setFaculty)
      .finally(() => setLoading(false));
  }, [currentSchool.id]);

  const filtered = faculty.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <UserCheck className={`w-10 h-10 ${currentSchool.color}`} />
            Faculty Transparency
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Verified professor profiles and subject expertise maps.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or subject..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))
        ) : filtered.map((prof) => (
          <div key={prof.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform`}>
              <GraduationCap className="w-32 h-32" />
            </div>

            <div className="flex items-start gap-6 relative z-10">
              <div className={`w-20 h-20 rounded-2xl ${currentSchool.bg} flex items-center justify-center text-3xl font-black ${currentSchool.color}`}>
                {prof.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{prof.name}</h2>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">Verified</span>
                </div>
                <div className="text-slate-500 font-bold flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4" /> {prof.qualification}
                </div>
                <div className="text-slate-400 font-medium text-xs">
                  {prof.experience}+ Years institutional Experience
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
              <div className="space-y-3">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Book className="w-3.5 h-3.5" /> Current Subjects
                </div>
                <div className="flex flex-wrap gap-2">
                  {prof.subjects.map(s => (
                    <span key={s} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100 italic">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" /> Key Achievement
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  "{prof.achievements}"
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <a href={`mailto:${prof.email}`} className={`flex items-center gap-2 px-6 py-2.5 ${currentSchool.bg} ${currentSchool.color} rounded-xl font-bold text-sm hover:opacity-80 transition shadow-sm`}>
                <Mail className="w-4 h-4" /> Contact via Portal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
