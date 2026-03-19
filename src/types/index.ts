export interface CustomCategory {
  id: string;
  name: string;
  color: "success" | "warning" | "danger" | "primary" | "info" | "neutral";
}

export interface Reminder {
  id: string;
  title: string;
  amount?: number;
  lateFee?: number; // Optional late fee for missed impact
  dueDate: string; // ISO date string
  category: string; // ID of the category
  isCompleted: boolean;
  recurring: 'none' | 'weekly' | 'monthly';
  completedAt?: string; // ISO date string if completed
  notes?: string;
  url?: string;
  autoPay?: boolean;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HealthScore {
  score: number; // 0 to 100
  label: 'Strong' | 'Good' | 'Needs Attention';
}
