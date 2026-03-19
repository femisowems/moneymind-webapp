"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";

const MESSAGES = {
  completion: {
    funny: ["Nice 😎 you're staying consistent.", "Look at you, doing adult things! 🏆", "Boom! Another one bites the dust. 🐸"],
    calm: ["Well done. You're on track.", "Peace of mind achieved. 🧘", "A step forward on your financial journey."],
    savage: ["About time you handled that. 😈", "Took you long enough.", "Wow, a bare minimum adulting award for you 🏅"],
  },
  missed: {
    funny: ["Your future self is disappointed 😬", "Ope! Slipped through the cracks. 🥚", "Oopsie daisies, that one got away! 🥀"],
    calm: ["Let's get back on track tomorrow. 🌱", "A small setback. You can recover this.", "Refocus and try again. 🌊"],
    savage: ["Are you even trying? 🤦", "Enjoy those late fees. 💸", "Your wallet is crying right now. 😭"],
  },
  neutral: {
    funny: ["Let's stay on track 💪", "Time to make some money moves! 💃", "Ready to conquer those bills?"],
    calm: ["A peaceful day for your finances.", "Steady progress is good progress.", "Balance is key."],
    savage: ["Don't mess this up today.", "Stop scrolling and check your budget.", "I'm watching your spending... 👀"],
  }
};

type Tone = 'funny' | 'calm' | 'savage';

export function NudgeMessage() {
  const { reminders } = useStore();
  const [tone, setTone] = useState<Tone>('funny');
  const [message, setMessage] = useState("");

  const getRandomMessage = (category: keyof typeof MESSAGES, t: Tone) => {
    const list = MESSAGES[category][t];
    return list[Math.floor(Math.random() * list.length)];
  };

  useEffect(() => {
    const today = new Date();
    // Simplified missed check for purely overdue
    const missed = reminders.some(r => {
      const isPast = new Date(r.dueDate) < today;
      const isNotToday = r.dueDate.substring(0, 10) !== today.toISOString().substring(0, 10);
      return !r.isCompleted && isPast && isNotToday;
    });
    
    const completedToday = reminders.some(r => r.isCompleted && r.completedAt && r.completedAt.substring(0, 10) === today.toISOString().substring(0, 10));

    setTimeout(() => {
      if (missed) {
        setMessage(getRandomMessage('missed', tone));
      } else if (completedToday) {
        setMessage(getRandomMessage('completion', tone));
      } else {
        setMessage(getRandomMessage('neutral', tone));
      }
    }, 0);
  }, [reminders, tone]);

  // Make sure hydration matches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Today&apos;s Focus</h2>
        <div className="flex gap-2 text-xs bg-gray-100 rounded-full p-1">
          <button onClick={() => setTone('funny')} className={`px-3 py-1 rounded-full transition-all ${tone === 'funny' ? 'bg-white shadow-sm text-foreground font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>🐸 Funny</button>
          <button onClick={() => setTone('calm')} className={`px-3 py-1 rounded-full transition-all ${tone === 'calm' ? 'bg-white shadow-sm text-foreground font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>🧘 Calm</button>
          <button onClick={() => setTone('savage')} className={`px-3 py-1 rounded-full transition-all ${tone === 'savage' ? 'bg-white shadow-sm text-foreground font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>😈 Savage</button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-2xl md:text-3xl font-bold text-foreground leading-tight"
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
