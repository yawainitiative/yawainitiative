import { Program, Event, Opportunity, SuccessStory, VolunteerTask } from './types';

export const APP_NAME = "YAWAI";

export const PROGRAMS: Program[] = [
  {
    id: 'p1',
    title: 'Digital Skills 101',
    category: 'Digital Skills',
    description: 'Learn the basics of coding, design, and digital marketing.',
    duration: '6 Weeks',
    image: 'https://picsum.photos/400/250?random=10'
  },
  {
    id: 'p2',
    title: 'Women in Leadership',
    category: 'Leadership',
    description: 'Executive coaching for aspiring female leaders.',
    duration: '3 Months',
    image: 'https://picsum.photos/400/250?random=11'
  },
  {
    id: 'p3',
    title: 'SME Business Booster',
    category: 'Business',
    description: 'Scaling your small business effectively.',
    duration: '4 Weeks',
    image: 'https://picsum.photos/400/250?random=12'
  }
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Annual Youth Summit',
    date: 'Oct 24, 2023',
    location: 'City Convention Center',
    description: 'A gathering of young minds to discuss future policy.',
    image: 'https://picsum.photos/400/250?random=20'
  },
  {
    id: 'e2',
    title: 'Charity Gala Night',
    date: 'Nov 05, 2023',
    location: 'Grand Hotel Ballroom',
    description: 'Fundraising for our rural outreach programs.',
    image: 'https://picsum.photos/400/250?random=21'
  }
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1',
    type: 'Scholarship',
    title: 'STEM Scholarship 2024',
    organization: 'TechCorp Foundation',
    deadline: 'Dec 31, 2023',
    link: '#'
  },
  {
    id: 'o2',
    type: 'Job',
    title: 'Community Manager',
    organization: 'YAWAI HQ',
    deadline: 'Nov 15, 2023',
    link: '#'
  },
  {
    id: 'o3',
    type: 'Grant',
    title: 'Small Business Grant',
    organization: 'Global Aid',
    deadline: 'Jan 20, 2024',
    link: '#'
  }
];

export const STORIES: SuccessStory[] = [
  {
    id: 's1',
    author: 'Sarah Jenkins',
    role: 'Program Alumni',
    content: 'Through YAWAI, I learned to code and now I work as a frontend developer!',
    image: 'https://picsum.photos/100/100?random=30'
  },
  {
    id: 's2',
    author: 'David Okon',
    role: 'Volunteer',
    content: 'Volunteering here gave me purpose and connected me with amazing mentors.',
    image: 'https://picsum.photos/100/100?random=31'
  }
];

export const VOLUNTEER_TASKS: VolunteerTask[] = [
  { 
    id: 'v1', 
    title: 'Event Setup - Annual Summit', 
    category: 'Event Support',
    description: 'Help arrange chairs, set up banners, and manage the registration desk for our biggest event of the year.',
    date: 'Oct 23, 2023', 
    location: 'City Convention Center',
    hours: 4, 
    status: 'Open',
    spots: 5
  },
  { 
    id: 'v2', 
    title: 'Junior Mentorship Session', 
    category: 'Mentorship',
    description: 'Provide guidance to high school students regarding career choices in STEM.',
    date: 'Oct 10, 2023', 
    location: 'Remote (Zoom)',
    hours: 2, 
    status: 'Completed' 
  },
  { 
    id: 'v3', 
    title: 'Social Media Advocacy', 
    category: 'Advocacy',
    description: 'Create and share graphics for the "Women in Tech" campaign week.',
    date: 'Nov 01, 2023', 
    location: 'Remote',
    hours: 3, 
    status: 'Open',
    spots: 10
  },
  { 
    id: 'v4', 
    title: 'Community Clean-up Drive', 
    category: 'Field Work',
    description: 'Join the team to clean up the local park and plant new trees.',
    date: 'Nov 12, 2023', 
    location: 'Central Park, Lagos',
    hours: 5, 
    status: 'Open',
    spots: 20
  },
  { 
    id: 'v5', 
    title: 'Data Entry for New Members', 
    category: 'Administrative',
    description: 'Assist the HR team in digitizing new member registration forms.',
    date: 'Oct 28, 2023', 
    location: 'YAWAI HQ',
    hours: 4, 
    status: 'Assigned' 
  },
];