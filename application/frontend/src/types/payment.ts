export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'paypal';

export interface PaymentTransaction {
  id: string;
  userId: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
