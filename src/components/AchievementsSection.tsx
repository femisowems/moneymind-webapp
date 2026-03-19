"use client";

import { useStore } from "@/store/useStore";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useEffect, useState } from "react";

export function AchievementsSection() {
  const { unlockedAchievements } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <section className="mb-10">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Badges & Achievements</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className={`flex shrink-0 items-center gap-3 p-3 rounded-2xl border transition-all ${
                isUnlocked 
                  ? 'bg-white border-yellow-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
              }`}
            >
              <div className={`text-2xl w-10 h-10 flex flex-col items-center justify-center rounded-full ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                {ach.icon}
              </div>
              <div className="flex flex-col pr-2">
                <span className={`font-bold text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{ach.title}</span>
                <span className="text-xs text-gray-400 max-w[120px]">{ach.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
