export type UserRole = 'user' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  bio?: string;
  volunteerHours: number;
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
}

export interface Program {
  id: string;
  title: string;
  // Added 'Skill Acquisition' to the category union to allow filtering for training tracks
  category: 'Digital Skills' | 'Business' | 'Leadership' | 'Empowerment' | 'Skill Acquisition';
  description: string;
  duration: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  image: string;
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
