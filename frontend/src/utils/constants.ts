export const ITEM_CATEGORIES = [
  'Textbooks & Reference Books',
  'Lab Equipment & Instruments',
  'Electronics & Circuit Components',
  'Microcontrollers & Development Boards',
  'Mechanical Tools & Instruments',
  'Software & Licenses',
  'Calculators & Computing Devices',
  'Drawing & Drafting Tools',
  'Safety Equipment',
  'Project Components',
  'Other',
];

export const ITEM_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const REQUEST_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const TRANSACTION_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  DISPUTED: 'disputed',
};

export const VERIFICATION_STATUSES = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGES_PER_ITEM = 5;

export const SERVICE_CATEGORIES = [
  'Tutoring',
  'Photography',
  'Graphic Design',
  'Web Development',
  'Content Writing',
  'Video Editing',
  'Music Lessons',
  'Fitness Training',
  'Language Teaching',
  'Event Planning',
  'Other',
];

export const PRICING_MODELS = [
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'flat_fee', label: 'Flat Fee' },
  { value: 'negotiable', label: 'Negotiable' },
];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  BROWSE: '/browse',
  ITEM_DETAIL: '/items/:id',
  CREATE_ITEM: '/items/create',
  EDIT_ITEM: '/items/:id/edit',
  MY_ITEMS: '/my-items',
  MY_REQUESTS: '/my-requests',
  RECEIVED_REQUESTS: '/received-requests',
  TRANSACTIONS: '/transactions',
  PROFILE: '/profile/:id',
  EDIT_PROFILE: '/profile/edit',
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:id',
  SKILLS: '/skills',
  SKILL_DETAIL: '/skills/:id',
  CREATE_SKILL: '/skills/create',
  MY_SKILLS: '/my-skills',
  SKILL_BOOKINGS: '/skill-bookings',
};
