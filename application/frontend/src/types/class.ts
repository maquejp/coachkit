export type Intensity = 'beginner' | 'intermediate' | 'advanced';

export interface ClassType {
  id: string;
  name: string;
  description: string;
  color: string;
  durationMinutes: number;
  capacity: number;
  defaultPriceCents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
