export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  interval: 'monthly' | 'yearly';
  trialDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  trialEnd: string | null;
  sessionsUsed: number;
  sessionsLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PointCardPlan {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  sessionsCount: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PointCardPurchase {
  id: string;
  userId: string;
  planId: string;
  sessionsRemaining: number;
  expiresAt: string;
  purchasedAt: string;
}
