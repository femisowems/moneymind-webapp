"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { Zap, Share2 } from "lucide-react";
import { ShareScorecardModal } from "./ShareScorecardModal";

export function PlayerLevelBar() {
  const { score } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  const currentLevelXP = (score.level - 1) * 100;
  const xpIntoLevel = score.xp - currentLevelXP;
  // Fallback calculation using 100 since nextLevelXP - currentLevelXP is always 100 in our formula
  const progressPercent = Math.min((xpIntoLevel / 100) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 mb-6 flex items-center justify-between gap-4 w-full cursor-default group hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white transform group-hover:scale-105 transition-transform">
          {score.level}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-gray-900 tracking-tight">Level {score.level}</span>
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {score.xp} XP
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-sm hidden sm:block relative">
        <div className="flex justify-between text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">
          <span>{xpIntoLevel} / 100 XP</span>
          <span className="text-primary">{100 - xpIntoLevel} TO GO</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-[#7050ff] rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>
      
      <div className="text-right flex flex-col items-end hidden sm:flex">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Next Lvl</span>
        <span className="text-sm font-bold text-primary">{100 - xpIntoLevel} XP</span>
      </div>

      <button 
        onClick={() => setIsShareOpen(true)}
        className="ml-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-primary/10 hover:to-primary/5 text-gray-600 hover:text-primary font-bold p-3 rounded-xl transition-all shadow-sm border border-gray-200 hover:border-primary/20 flex flex-col items-center justify-center shrink-0"
        title="Share Scorecard"
      >
        <Share2 className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] uppercase tracking-wider">Share</span>
      </button>

      <ShareScorecardModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
