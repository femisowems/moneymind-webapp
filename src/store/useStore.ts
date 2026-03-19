import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Reminder, Streak, CustomCategory } from '../types';
import { isSameDay, differenceInDays } from 'date-fns';

interface AppState {
  reminders: Reminder[];
  streak: Streak;
  score: { value: number; label: 'Strong' | 'Good' | 'Needs Attention' };
  categories: CustomCategory[];
  unlockedAchievements: string[];
  
  // Actions
  addReminder: (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => void;
  addCategory: (category: Omit<CustomCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  calculateScore: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      reminders: [],
      streak: {
        currentStreak: 0,
        longestStreak: 0,
      },
      score: { value: 100, label: 'Strong' },
      unlockedAchievements: [],
      categories: [
        { id: '1', name: 'Bills', color: 'danger' },
        { id: '2', name: 'Savings', color: 'success' },
        { id: '3', name: 'Subscriptions', color: 'primary' },
        { id: '4', name: 'Other', color: 'neutral' },
      ],

      addCategory: (catData) => {
        set((state) => ({
          categories: [...state.categories, { ...catData, id: crypto.randomUUID() }]
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter(c => c.id !== id)
        }));
      },

      addReminder: (reminderData) => {
        const newReminder: Reminder = {
          ...reminderData,
          id: crypto.randomUUID(),
          isCompleted: false,
        };
        set((state) => ({ reminders: [...state.reminders, newReminder] }));
        get().calculateScore();
      },

      toggleReminder: (id: string) => {
        set((state) => {
          const now = new Date();
          const updatedReminders = state.reminders.map((r) => {
            if (r.id === id) {
              const isCompleted = !r.isCompleted;
              return {
                ...r,
                isCompleted,
                completedAt: isCompleted ? now.toISOString() : undefined,
              };
            }
            return r;
          });

          // Update Streak
          const newStreak = { ...state.streak };
          const completedReminders = updatedReminders.filter((r) => r.isCompleted);
          
          if (completedReminders.length > 0) {
            // Very simplified streak logic for MVP: +1 if they completed something today and didn't already
            if (
              !newStreak.lastCompletedDate ||
              !isSameDay(new Date(newStreak.lastCompletedDate), now)
            ) {
              if (
                newStreak.lastCompletedDate &&
                differenceInDays(now, new Date(newStreak.lastCompletedDate)) > 1
              ) {
                // Streak broken
                newStreak.currentStreak = 1;
              } else {
                newStreak.currentStreak += 1;
              }
              newStreak.lastCompletedDate = now.toISOString();
              
              if (newStreak.currentStreak > newStreak.longestStreak) {
                newStreak.longestStreak = newStreak.currentStreak;
              }
            }
          }

          // Check Achievements
          const newUnlocked = [...state.unlockedAchievements];
          if (!newUnlocked.includes('first_blood') && completedReminders.length > 0) {
            newUnlocked.push('first_blood');
          }
          if (!newUnlocked.includes('streak_3') && newStreak.currentStreak >= 3) {
            newUnlocked.push('streak_3');
          }
          if (!newUnlocked.includes('streak_7') && newStreak.currentStreak >= 7) {
            newUnlocked.push('streak_7');
          }
          if (!newUnlocked.includes('rich_boy') && completedReminders.some(r => r.amount && r.amount >= 100)) {
            newUnlocked.push('rich_boy');
          }
          if (!newUnlocked.includes('saved_late_fee') && completedReminders.some(r => r.lateFee && r.lateFee > 0)) {
            newUnlocked.push('saved_late_fee');
          }

          return { reminders: updatedReminders, streak: newStreak, unlockedAchievements: newUnlocked };
        });
        
        
        get().calculateScore();
      },

      deleteReminder: (id: string) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
        get().calculateScore();
      },

      updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => {
        set((state) => ({
          reminders: state.reminders.map((r) => 
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
        get().calculateScore();
      },

      calculateScore: () => {
        set((state) => {
          const { reminders, streak } = state;
          if (reminders.length === 0) return { score: { value: 100, label: 'Strong' } };

          const completed = reminders.filter((r) => r.isCompleted).length;
          const total = reminders.length;
          
          // Basic formula: completion ratio (70%) + streak bonus (max 30%)
          const completionRatio = (completed / total) * 70;
          const streakBonus = Math.min((streak.currentStreak / 7) * 30, 30); // Max bonus at 7 days
          
          const rawScore = Math.round(completionRatio + streakBonus);
          let label: 'Strong' | 'Good' | 'Needs Attention' = 'Needs Attention';
          
          if (rawScore >= 80) label = 'Strong';
          else if (rawScore >= 50) label = 'Good';

          return { score: { value: rawScore, label } };
        });
      },
    }),
    {
      name: 'moneymind-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
