export type PlanId = 'trial' | 'normal' | 'pro' | 'max';
export type BillingCycle = 'monthly' | 'yearly';
export type UserRole = 'admin' | 'chef' | 'waiter';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanInfo {
  id: PlanId;
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  priceMonthlyKHR: number;
  priceYearlyKHR: number;
  description: string;
  trialDays?: number;
  limits: {
    tables: number | 'Unlimited';
    menuItems: number | 'Unlimited';
    staffAccounts: number | 'Unlimited';
    kdsScreens: number | 'Unlimited';
    customDomain: boolean;
    khqrDirect: boolean;
    analytics: 'Basic' | 'Advanced' | 'Enterprise';
    support: 'Community' | 'Email' | 'Priority 24/7' | 'Dedicated Manager';
  };
  features: string[];
  ctaText: string;
  isPaid: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  nameKhmer?: string;
  category: string;
  priceUSD: number;
  priceKHR: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isPopular?: boolean;
  tags?: string[];
}

export interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  ownerName: string;
  phone: string;
  email: string;
  planType: PlanId;
  billingCycle: BillingCycle;
  planExpiry: string; // ISO date
  isTrial: boolean;
  trialDaysRemaining?: number;
  phoneVerified: boolean;
  createdAt: string;
  status: 'active' | 'pending_payment' | 'expired';
  logoUrl?: string;
  coverUrl?: string;
  address?: string;
  telegramChatId?: string;
  currency: 'USD' | 'KHR' | 'BOTH';
  menuItems: MenuItem[];
  categories: string[];
  tablesCount: number;
}

export interface RegistrationFormData {
  businessName: string;
  slug: string;
  ownerName: string;
  phone: string;
  countryCode: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedPlan: PlanId;
  billingCycle: BillingCycle;
  agreeTerms: boolean;
}

export interface OTPVerificationState {
  phone: string;
  countryCode: string;
  method: 'sms' | 'telegram';
  code: string;
  sentAt: number;
  expiresAt: number;
  isVerified: boolean;
  attempts: number;
  pendingTenantData?: RegistrationFormData;
}

export interface PaymentSession {
  transactionId: string;
  tenantSlug: string;
  tenantName: string;
  plan: PlanId;
  billingCycle: BillingCycle;
  amountUSD: number;
  amountKHR: number;
  qrString: string;
  paymentMethod: 'khqr_bakong' | 'aba_pay' | 'acleda';
  status: 'pending' | 'scanned' | 'completed' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export interface UserSession {
  tenant: Tenant;
  role: UserRole;
  token: string;
  loggedInAt: string;
}

export interface NotificationLog {
  id: string;
  recipient: string;
  type: 'telegram' | 'email' | 'sms';
  subject: string;
  message: string;
  sentAt: string;
  menuLink: string;
  adminLink: string;
}
