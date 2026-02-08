export const ITEM_CATEGORIES = [
  'Electronics',
  'Books',
  'Sports Equipment',
  'Musical Instruments',
  'Furniture',
  'Kitchen Appliances',
  'Clothing',
  'Tools',
  'Gaming',
  'Photography',
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
};
