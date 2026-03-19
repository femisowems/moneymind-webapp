export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', title: 'Adulting 101', description: 'Complete your first reminder.', icon: '👶' },
  { id: 'streak_3', title: 'On A Roll', description: 'Reach a 3-day consistency streak.', icon: '🔥' },
  { id: 'streak_7', title: 'Unstoppable', description: 'Reach a 7-day consistency streak.', icon: '🚀' },
  { id: 'rich_boy', title: 'Money Moves', description: 'Complete a large financial task (>$100).', icon: '💸' },
  { id: 'saved_late_fee', title: 'Penny Pincher', description: 'Avoid a potential late fee by paying on time.', icon: '💰' },
];
