export type TaskStatus = 'locked' | 'upcoming' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  deadline: string;
  status: TaskStatus;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  xp: number;
  streak: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
  progress: number;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'task_completed' | 'proof_submitted' | 'streak_milestone' | 'rank_change';
  title: string;
  detail?: string;
  timestamp: string; // ISO
}

export interface PublicProfile {
  id: string;
  displayName: string;
  handle: string;
  headline: string;
  bio: string;
  location?: string;
  website?: string;
  avatarInitials: string;
  // For now, images are stored client-side (data URLs) on the Profile page.
}

export const mockPublicProfile: PublicProfile = {
  id: "me",
  displayName: "Vimal Prasath",
  handle: "vimal",
  headline: "AI/ML Learner • Building in public",
  bio: "Competing weekly with a private roadmap group. Shipping consistently, sharing proofs, and improving fundamentals.",
  location: "India",
  website: "https://linkedin.com",
  avatarInitials: "VP",
};

export const mockUsers: User[] = [
  { id: '1', name: 'Alex K.', avatar: 'AK', handle: 'alex', xp: 4500, streak: 12, rank: 1, trend: 'same', progress: 85 },
  { id: '2', name: 'Sarah M.', avatar: 'SM', handle: 'sarah', xp: 4250, streak: 8, rank: 2, trend: 'up', progress: 80 },
  { id: '3', name: 'Vimal P.', avatar: 'VP', handle: 'vimal', xp: 4100, streak: 15, rank: 3, trend: 'up', progress: 78 },
  { id: '4', name: 'David C.', avatar: 'DC', handle: 'david', xp: 3800, streak: 5, rank: 4, trend: 'down', progress: 70 },
  { id: '5', name: 'Elena R.', avatar: 'ER', handle: 'elena', xp: 3200, streak: 2, rank: 5, trend: 'same', progress: 60 },
  { id: '6', name: 'James T.', avatar: 'JT', handle: 'james', xp: 2800, streak: 0, rank: 6, trend: 'down', progress: 52 },
];

export const mockActivity: ActivityEvent[] = [
  {
    id: 'a1',
    userId: '2',
    userName: 'Sarah M.',
    userAvatar: 'SM',
    type: 'rank_change',
    title: 'Moved up to #2',
    detail: 'Solid week of submissions pushed you past the pack.',
    timestamp: '2026-05-09T04:10:00.000Z',
  },
  {
    id: 'a2',
    userId: '3',
    userName: 'Vimal P.',
    userAvatar: 'VP',
    type: 'streak_milestone',
    title: 'Hit a 15-day streak',
    detail: 'No missed days. Keep the momentum.',
    timestamp: '2026-05-08T17:40:00.000Z',
  },
  {
    id: 'a3',
    userId: '1',
    userName: 'Alex K.',
    userAvatar: 'AK',
    type: 'task_completed',
    title: 'Completed “Linear Algebra Core”',
    detail: '+600 XP',
    timestamp: '2026-05-08T11:15:00.000Z',
  },
  {
    id: 'a4',
    userId: '4',
    userName: 'David C.',
    userAvatar: 'DC',
    type: 'proof_submitted',
    title: 'Submitted proof for “Implement SVM from Scratch”',
    detail: 'Awaiting verification.',
    timestamp: '2026-05-07T19:05:00.000Z',
  },
];

export const mockRoadmap: Section[] = [
  {
    id: 's1',
    title: 'Foundations',
    tasks: [
      {
        id: 't1',
        title: 'Python for AI Mastery',
        description: 'Complete the advanced Python concepts module focusing on memory management, generators, and decorators.',
        xp: 500,
        deadline: '2026-05-10',
        status: 'completed',
      },
      {
        id: 't2',
        title: 'Linear Algebra Core',
        description: 'Matrix transformations, eigenvalues, eigenvectors, and singular value decomposition.',
        xp: 600,
        deadline: '2026-05-15',
        status: 'completed',
      },
    ],
  },
  {
    id: 's2',
    title: 'Machine Learning',
    tasks: [
      {
        id: 't3',
        title: 'Implement SVM from Scratch',
        description: 'Build a Support Vector Machine without using scikit-learn. Submit code and performance metrics.',
        xp: 800,
        deadline: '2026-05-20',
        status: 'in-progress',
      },
      {
        id: 't4',
        title: 'Gradient Boosting Trees',
        description: 'Master XGBoost and LightGBM tuning parameters on the housing dataset.',
        xp: 750,
        deadline: '2026-05-25',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 's3',
    title: 'Deep Learning',
    tasks: [
      {
        id: 't5',
        title: 'PyTorch Fundamentals',
        description: 'Build your first neural network for image classification using PyTorch.',
        xp: 1000,
        deadline: '2026-06-05',
        status: 'locked',
      },
      {
        id: 't6',
        title: 'Transformers Architecture',
        description: 'Understand the "Attention is All You Need" paper and implement self-attention.',
        xp: 1200,
        deadline: '2026-06-15',
        status: 'locked',
      },
    ],
  },
];
