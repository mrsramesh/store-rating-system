// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: User;
  overallRating: number;
  totalRatings: number;
  userRating?: number;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  ratingValue: number;
  createdAt: string;
  user?: User;
  store?: Store;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  userName: string;
  storeName: string;
  rating: number;
  date: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}