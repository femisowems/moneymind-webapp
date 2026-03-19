"use client";

import { useStore } from "@/store/useStore";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import { Trophy } from "lucide-react";
import { BadgeDetailsModal } from "./BadgeDetailsModal";
import { useState } from "react";
import { motion } from "framer-motion";

export function AchievementsSection() {
  const storeState = useStore();
  const { unlockedAchievements } = storeState;
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const getTierColors = (tier: Achievement['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) return "bg-gray-50 border-gray-100 text-gray-300 opacity-60 grayscale";
    switch (tier) {
      case 'platinum': return "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-indigo-100/50 shimmer";
      case 'gold': return "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100/50";
      case 'silver': return "bg-slate-50 border-slate-300 text-slate-700 shadow-slate-200/50";
      case 'bronze': return "bg-orange-50 border-orange-200 text-orange-800 shadow-orange-100/50";
      default: return "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100/50";
    }
  };

  const visibleAchievements = ACHIEVEMENTS.filter(a => 
    !a.isHidden || (a.isHidden && unlockedAchievements.includes(a.id))
  );

  return (
    <>
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Trophy className="w-4 h-4" /> Badges & Achievements
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const progress = achievement.getProgress ? achievement.getProgress(storeState) : (isUnlocked ? (achievement.maxProgress || 1) : 0);
            const max = achievement.maxProgress || 1;
            const percent = Math.min((progress / max) * 100, 100);

            return (
              <motion.button 
                key={achievement.id}
                onClick={() => setSelectedBadge(achievement)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-3xl border shadow-sm transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-md ${getTierColors(achievement.tier, isUnlocked)}`}
              >
                <div className="relative w-14 h-14 mb-3 flex items-center justify-center">
                  {!isUnlocked && achievement.maxProgress && achievement.maxProgress > 1 && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 opacity-50" />
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="none" 
                        className="text-primary transition-all duration-1000 ease-out" 
                        strokeDasharray="289" strokeDashoffset={289 - (289 * percent) / 100} 
                        strokeLinecap="round" />
                    </svg>
                  )}
                  <span className="text-3xl filter drop-shadow-sm z-10">{achievement.icon}</span>
                  {isUnlocked && achievement.tier === 'platinum' && (
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse z-0" />
                  )}
                </div>
                <h3 className="text-sm font-bold mb-1 tracking-tight">{achievement.title}</h3>
                {!isUnlocked && achievement.maxProgress && achievement.maxProgress > 1 && (
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                    {progress} / {max}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {selectedBadge && (
        <BadgeDetailsModal 
          isOpen={true} 
          onClose={() => setSelectedBadge(null)} 
          achievement={selectedBadge} 
        />
      )}
    </>
  );
}
