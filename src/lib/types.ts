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
  { label: "Indoor workout (45 min)", description: "First of two daily workouts" },
  { label: "Outdoor workout (45 min)", description: "Second workout must be outdoors" },
  { label: "Follow chosen diet", description: "No cheat meals" },
  { label: "No alcohol" },
  { label: "Drink 1 gallon of water" },
  { label: "Read 10 pages of a non-fiction book" },
  { label: "Take a progress photo" },
];

export const STANDARD_DURATION_DAYS = 75;
