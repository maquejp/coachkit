export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  role: 'admin';
  fullName: string;
}

export interface CustomerUser extends User {
  role: 'customer';
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
}
