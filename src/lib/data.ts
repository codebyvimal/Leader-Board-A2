import { supabase } from "./supabase";

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
  avatarUrl?: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'task_completed' | 'proof_submitted' | 'streak_milestone' | 'rank_change' | 'task_assigned';
  title: string;
  detail?: string;
  timestamp: string;
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
  avatarUrl?: string;
  coverUrl?: string;
  xp?: number;
}

// Supabase fetch functions
export async function getLeaderboard(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url, xp, streak, level")
    .order("xp", { ascending: false });

  if (error || !data) return [];

  return data.map((profile, index) => ({
    id: profile.id,
    name: profile.display_name || profile.username || "Operator",
    avatar: (profile.display_name || profile.username || "OP").substring(0, 2).toUpperCase(),
    handle: profile.username || "operator",
    xp: profile.xp || 0,
    streak: profile.streak || 0,
    rank: index + 1,
    trend: 'same',
    progress: Math.min((profile.xp || 0) / 100, 100),
    avatarUrl: profile.avatar_url,
  }));
}

export async function getActivity(): Promise<ActivityEvent[]> {
  const { data, error } = await supabase
    .from("activity")
    .select("*, profiles(display_name, username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((event: any) => ({
    id: event.id,
    userId: event.user_id,
    userName: event.profiles?.display_name || event.profiles?.username || "Operator",
    userAvatar: (event.profiles?.display_name || event.profiles?.username || "OP").substring(0, 2).toUpperCase(),
    type: event.action_type || 'task_completed',
    title: event.title,
    detail: event.detail,
    timestamp: event.created_at,
  }));
}

export async function getRoadmap(): Promise<Section[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("order_index", { ascending: true });

  if (error || !data) return [];

  const sectionsMap = new Map<string, Section>();
  
  data.forEach((task: any) => {
    if (!sectionsMap.has(task.section_title)) {
      sectionsMap.set(task.section_title, {
        id: task.section_title,
        title: task.section_title,
        tasks: [],
      });
    }
    
    sectionsMap.get(task.section_title)!.tasks.push({
      id: task.id,
      title: task.title,
      description: task.description || "",
      xp: task.xp_reward || 0,
      deadline: task.deadline || "",
      status: task.status || "upcoming",
    });
  });

  return Array.from(sectionsMap.values());
}

export async function getCurrentProfile(): Promise<PublicProfile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    displayName: data.display_name || data.username || "Operator",
    handle: data.username || "operator",
    headline: data.headline || "",
    bio: data.bio || "",
    location: data.location || "",
    website: data.website || "",
    avatarInitials: (data.display_name || data.username || "OP").substring(0, 2).toUpperCase(),
    avatarUrl: data.avatar_url,
    coverUrl: data.cover_url,
    xp: data.xp || 0,
  };
}

export async function getRoadmapNodes() {
  const { data, error } = await supabase.from("roadmap_nodes").select("*");
  if (error || !data) return [];
  return data;
}

export async function getRoadmapEdges() {
  const { data, error } = await supabase.from("roadmap_edges").select("*");
  if (error || !data) return [];
  return data;
}

// Temporary fallback empty data for synchronous initial renders if needed
export const fallbackProfile: PublicProfile = {
  id: "",
  displayName: "Operator",
  handle: "operator",
  headline: "Awaiting Sync",
  bio: "Initialize connection to load data.",
  avatarInitials: "OP",
  xp: 0,
};
