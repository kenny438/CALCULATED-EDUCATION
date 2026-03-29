import { LucideIcon } from "lucide-react";

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarSeed: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'true-false' | 'flashcard' | 'checklist' | 'poll';
  question: string;
  options?: string[];
  correctAnswer?: string;
  front?: string;
  back?: string;
  items?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  isCompleted?: boolean;
  questions?: Question[];
  resources?: { title: string; url: string }[];
  mindmap?: string;
  tutorNotes?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "Technology" | "Business" | "Arts" | "Science" | "Lifestyle";
  instructor: {
    id: string;
    name: string;
    avatarSeed: string;
    avatarUrl?: string;
    bio: string;
    qualifications?: string;
    email?: string;
  };
  price: number;
  students: number;
  rating: number;
  lessons: Lesson[];
  image?: string;
  comments: Comment[];
  level: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  status?: 'published' | 'draft';
  uiStyle?: 'standard' | 'progression-map';
  visibility?: 'public' | 'unlisted' | 'private';
  certificate?: boolean;
  language?: string;
  estimatedTime?: string;
}

export interface Enrollment {
  courseId: string;
  progress: number;
  enrolledAt: string;
  lastAccessed: string;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  avatarSeed: string;
  avatarUrl?: string;
  joinedDate: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  onboardingCompleted?: boolean;
  xp?: number;
  level?: number;
  dailyStreak?: number;
  lastLogin?: string;
  referralCode?: string;
  qualifications?: string;
  interests?: string[];
  age?: number;
  isAdult?: boolean;
  canCreateCourses?: boolean;
}

export interface GroupMember {
  userId: string;
  username: string;
  avatarSeed: string;
  avatarUrl?: string;
  role: "admin" | "member";
  joinedAt: string;
  xpContributed: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  members: GroupMember[];
  createdAt: string;
  isPrivate: boolean;
  emoji?: string;
  themeColor?: string;
  rules?: string;
  maxMembers?: number;
}

export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Mastering React 19",
    description: "Learn the latest features of React 19, including Server Components, Actions, and the new use hook. Build a full-stack application from scratch.",
    category: "Technology",
    instructor: {
      id: "inst1",
      name: "Sarah Drasner",
      avatarSeed: "sarah",
      bio: "Senior Frontend Engineer and Educator",
      email: "mgethmikadinujakumarathunga@gmail.com"
    },
    price: 49.99,
    students: 12450,
    rating: 4.8,
    level: "Intermediate",
    image: "https://picsum.photos/seed/react/800/400",
    tags: ["React", "JavaScript", "Web Development"],
    status: "published",
    lessons: [
      { id: "l1", title: "Introduction to React 19", duration: "10:00", content: "Welcome to the course..." },
      { id: "l2", title: "Server Components Deep Dive", duration: "25:30", content: "Server components allow you to..." },
      { id: "l3", title: "Actions and Mutations", duration: "18:45", content: "Handling forms and data mutations..." }
    ],
    comments: [
      { id: "com1", userId: "u1", username: "Alex", avatarSeed: "alex", text: "This course is amazing! The explanation of Server Components finally clicked for me.", timestamp: new Date().toISOString(), likes: 12 }
    ]
  },
  {
    id: "c2",
    title: "The Art of Storytelling",
    description: "Discover how to craft compelling narratives for books, screenplays, and everyday communication.",
    category: "Arts",
    instructor: {
      id: "inst2",
      name: "Neil Gaiman",
      avatarSeed: "neil",
      bio: "Award-winning Author"
    },
    price: 89.99,
    students: 45200,
    rating: 4.9,
    level: "Beginner",
    image: "https://picsum.photos/seed/story/800/400",
    tags: ["Writing", "Creative", "Storytelling"],
    status: "published",
    lessons: [
      { id: "l1", title: "Finding Your Voice", duration: "15:20", content: "Your voice is your most powerful tool..." },
      { id: "l2", title: "Building Worlds", duration: "30:10", content: "World-building isn't just for fantasy..." }
    ],
    comments: []
  },
  {
    id: "c3",
    title: "Quantum Physics for Beginners",
    description: "A visual and intuitive introduction to the weird and wonderful world of quantum mechanics.",
    category: "Science",
    instructor: {
      id: "inst3",
      name: "Dr. Brian Greene",
      avatarSeed: "brian",
      bio: "Theoretical Physicist"
    },
    price: 29.99,
    students: 8900,
    rating: 4.7,
    level: "Beginner",
    image: "https://picsum.photos/seed/quantum/800/400",
    tags: ["Physics", "Science", "Quantum"],
    status: "published",
    lessons: [
      { id: "l1", title: "The Double Slit Experiment", duration: "22:00", content: "The experiment that changed everything..." }
    ],
    comments: []
  }
];
