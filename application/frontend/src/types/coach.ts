export interface Coach {
  id: string;
  name: string;
  bio: string;
  photoUrl: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
