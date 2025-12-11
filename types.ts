
export type UserRole = 'user' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  bio?: string;
  volunteerHours: number;
  joinedDate?: string;
  status?: 'active' | 'blocked';
}

export interface AppSettings {
  appName: string;
  tagline: string;
  logoUrl: string | null; // Base64 or URL
  contactEmail: string;
  accentColor: string;
}

export type SocialPlatform = 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  thumbnail: string;
  caption: string;
  redirectUrl: string;
  timestamp: string;
  likes: number;
  status: 'published' | 'hidden';
  isPinned?: boolean;
}

export interface Program {
  id: string;
  title: string;
  category: 'Digital Skills' | 'Business' | 'Leadership' | 'Empowerment';
  description: string;
  duration: string;
  image: string;
  requirements?: string;
  status?: 'draft' | 'published';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  image: string;
  rsvpCount?: number;
}

export interface Opportunity {
  id: string;
  type: 'Job' | 'Scholarship' | 'Grant' | 'Internship' | 'Bootcamp';
  title: string;
  organization: string;
  deadline: string;
  link: string;
}

export interface SuccessStory {
  id: string;
  author: string;
  role: string;
  content: string;
  image: string; // or video thumbnail
  videoUrl?: string;
  isApproved: boolean;
}

export interface VolunteerTask {
  id: string;
  title: string;
  category: 'Event Support' | 'Mentorship' | 'Advocacy' | 'Administrative' | 'Field Work';
  description: string;
  date: string;
  location: string;
  hours: number;
  status: 'Open' | 'Assigned' | 'Completed';
  spots?: number;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  campaign: string; // e.g., "General", "Tech Bootcamp"
}

export interface AdminStats {
  totalUsers: number;
  totalVolunteers: number;
  activePrograms: number;
  upcomingEvents: number;
  totalDonations: number;
  newSignups: number;
}
