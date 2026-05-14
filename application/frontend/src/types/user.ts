export type UserRole = 'admin' | 'customer' | 'instructor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  language?: string;
}

export interface AdminUser extends User {
  role: 'admin';
  fullName: string;
  firstName: string;
  lastName: string;
}

export interface CustomerUser extends User {
  role: 'customer';
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface InstructorUser extends User {
  role: 'instructor';
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  bio: string;
  coachId: string;
}
