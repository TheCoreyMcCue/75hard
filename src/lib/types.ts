export type Task = {
  id: string;
  label: string;
  description?: string;
};

export type ChallengeStatus = "active" | "completed" | "failed" | "abandoned";

export type Challenge = {
  userId: string;
  challengeId: string;
  status: ChallengeStatus;
  startDate: string;
  endDate?: string;
  tasks: Task[];
  durationDays: number;
  createdAt: string;
};

export type DailyLog = {
  userId: string;
  challengeId: string;
  dayNumber: number;
  date: string;
  completedTaskIds: string[];
  allCompleted: boolean;
  updatedAt: string;
};

export type User = {
  userId: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export const STANDARD_75HARD_TASKS: Omit<Task, "id">[] = [
  { label: "Workout 1 (45 min)", description: "One of today's two workouts must be outdoors" },
  { label: "Workout 2 (45 min)" },
  { label: "Follow chosen diet", description: "No cheat meals" },
  { label: "No alcohol" },
  { label: "Drink 1 gallon of water" },
  { label: "Read 10 pages of a non-fiction book" },
  { label: "Take a progress photo" },
];

export const STANDARD_DURATION_DAYS = 75;
