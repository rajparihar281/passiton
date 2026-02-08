export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type TransactionStatus = 'active' | 'completed' | 'overdue' | 'disputed';

export interface User {
  id: string;
  email: string;
  token?: string;
}

export interface Profile {
  id: string;
  college_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  trust_score: number;
  total_lends: number;
  total_borrows: number;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  domain: string;
  location: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  owner_id: string;
  college_id: string;
  title: string;
  description: string | null;
  category: string | null;
  condition: ItemCondition;
  is_available: boolean;
  deposit_amount: number;
  rental_price: number;
  created_at: string;
  owner?: Profile;
  images?: ItemImage[];
}

export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  is_primary: boolean;
}

export interface BorrowRequest {
  id: string;
  item_id: string;
  borrower_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  status: RequestStatus;
  message: string | null;
  created_at: string;
  item?: Item;
  borrower?: Profile;
  owner?: Profile;
}

export interface Transaction {
  id: string;
  request_id: string;
  item_id: string;
  borrower_id: string;
  owner_id: string;
  status: TransactionStatus;
  handover_time: string | null;
  return_time: string | null;
  created_at: string;
  item?: Item;
  borrower?: Profile;
  owner?: Profile;
}

export interface Review {
  id: string;
  transaction_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Profile;
}

export interface Conversation {
  id: string;
  item_id: string | null;
  created_at: string;
  participants?: Profile[];
  lastMessage?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export interface AuthResponse {
  user: User;
  profile: Profile;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ItemFilters {
  category?: string;
  condition?: ItemCondition;
  college_id?: string;
  search?: string;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface CreateItemData {
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  deposit_amount: number;
  rental_price: number;
  college_id: string;
  images: File[];
}

export interface CreateBorrowRequestData {
  item_id: string;
  start_date: string;
  end_date: string;
  message?: string;
}

export interface CreateReviewData {
  transaction_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}
