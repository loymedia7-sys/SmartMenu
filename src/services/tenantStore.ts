import { Tenant, RegistrationFormData, OTPVerificationState, PaymentSession, NotificationLog, UserSession, PlanId, BillingCycle, UserRole, MenuItem } from '../types';
import { SEED_TENANTS } from '../data/seedTenants';
import { PLANS } from '../data/plans';
import { db } from './firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

const TENANTS_STORAGE_KEY = 'menusaas_tenants_v1';
const OTP_STORAGE_KEY = 'menusaas_otp_state_v1';
const SESSION_STORAGE_KEY = 'menusaas_user_session_v1';
const NOTIFICATIONS_STORAGE_KEY = 'menusaas_notifications_v1';
const TRANSACTIONS_STORAGE_KEY = 'menusaas_transactions_v1';

const RESERVED_SLUGS = [
  'admin', 'login', 'register', 'pricing', 'checkout', 'api', 'dashboard', 'settings',
  'help', 'support', 'terms', 'privacy', 'menu', 'auth', 'verify', 'app', 'portal'
];

// Utility to clean objects for Firestore (removes undefined fields)
function sanitizeForFirestore<T>(obj: T): Record<string, any> {
  return JSON.parse(JSON.stringify(obj));
}

// Asynchronously sync tenants from Firestore cloud database
export async function syncTenantsFromFirestore(): Promise<Tenant[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'tenants'));
    if (!querySnapshot.empty) {
      const cloudTenants: Tenant[] = [];
      querySnapshot.forEach((d) => {
        cloudTenants.push(d.data() as Tenant);
      });
      if (cloudTenants.length > 0) {
        // Merge cloud tenants with existing local
        const local = getStoredTenants();
        const map = new Map<string, Tenant>();
        SEED_TENANTS.forEach(t => map.set(t.id, t));
        local.forEach(t => map.set(t.id, t));
        cloudTenants.forEach(t => map.set(t.id, t));
        const merged = Array.from(map.values());
        saveTenants(merged);
        console.log(`[Firestore] Synced ${cloudTenants.length} tenants from cloud database.`);
        return merged;
      }
    }
  } catch (err: any) {
    console.warn('[Firestore] Sync warning (Check Firebase Console -> Firestore Database & Security Rules):', err?.message || err);
  }
  return getStoredTenants();
}

// Trigger initial sync in background
if (typeof window !== 'undefined') {
  syncTenantsFromFirestore().catch(() => {});
}

function getStoredTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(SEED_TENANTS));
      return SEED_TENANTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tenants from storage', e);
    return SEED_TENANTS;
  }
}

function saveTenants(tenants: Tenant[]): void {
  try {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
  } catch (e) {
    console.error('Failed to save tenants to storage', e);
  }
}

// Generate URL slug from business name
export function generateSlug(businessName: string): string {
  if (!businessName) return '';
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // spaces to hyphen
    .replace(/-+/g, '-') // collapse hyphens
    .substring(0, 32);
}

// Validate slug format & availability
export function checkSlugAvailable(slug: string, currentTenantId?: string): { available: boolean; reason?: string } {
  const cleanSlug = slug.toLowerCase().trim();
  if (!cleanSlug) {
    return { available: false, reason: 'Shop URL cannot be empty' };
  }
  if (cleanSlug.length < 3) {
    return { available: false, reason: 'URL must be at least 3 characters long' };
  }
  if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
    return { available: false, reason: 'Only lowercase letters, numbers, and dashes are allowed' };
  }
  if (RESERVED_SLUGS.includes(cleanSlug)) {
    return { available: false, reason: `"${cleanSlug}" is a reserved system URL` };
  }

  const tenants = getStoredTenants();
  const existing = tenants.find(t => t.slug === cleanSlug && t.id !== currentTenantId);
  if (existing) {
    return { available: false, reason: `URL "yourapp.com/menu/${cleanSlug}" is already taken` };
  }

  return { available: true };
}

// Get all tenants
export function getAllTenants(): Tenant[] {
  return getStoredTenants();
}

// Get tenant by slug
export function getTenantBySlug(slug: string): Tenant | null {
  const tenants = getStoredTenants();
  return tenants.find(t => t.slug.toLowerCase() === slug.toLowerCase()) || null;
}

// Get tenant by ID
export function getTenantById(id: string): Tenant | null {
  const tenants = getStoredTenants();
  return tenants.find(t => t.id === id) || null;
}

// Create initial starter menu for newly registered tenant
function generateStarterMenu(businessName: string): { categories: string[]; menuItems: MenuItem[] } {
  return {
    categories: ['Signature Dishes', 'Beverages & Coffee', 'Snacks & Appetizers'],
    menuItems: [
      {
        id: `dish-${Date.now()}-1`,
        name: `${businessName} House Special`,
        nameKhmer: 'ម្ហូបពិសេសប្រចាំហាង',
        category: 'Signature Dishes',
        priceUSD: 6.5,
        priceKHR: 26650,
        description: 'Our top-rated signature recipe prepared fresh with organic local ingredients.',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        isPopular: true,
        tags: ['Signature', 'Fresh'],
      },
      {
        id: `dish-${Date.now()}-2`,
        name: 'Kampot Black Pepper Stir-Fry',
        nameKhmer: 'ឆាម្រេចខ្មៅកំពត',
        category: 'Signature Dishes',
        priceUSD: 5.5,
        priceKHR: 22550,
        description: 'Aromatic wok tossed dish seasoned with authentic GI Kampot black peppercorns.',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        isPopular: false,
        tags: ['Spicy', 'Chef Choice'],
      },
      {
        id: `dish-${Date.now()}-3`,
        name: 'Signature Iced Palm Coffee',
        nameKhmer: 'កាហ្វេស្ករត្នោតទឹកដោះគោ',
        category: 'Beverages & Coffee',
        priceUSD: 2.75,
        priceKHR: 11275,
        description: 'Double espresso pulled over natural palm sugar syrup and chilled milk.',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        isPopular: true,
        tags: ['Cold Brew', 'Refreshing'],
      },
      {
        id: `dish-${Date.now()}-4`,
        name: 'Crispy Garlic Spring Rolls (4 pcs)',
        nameKhmer: 'ណែមបំពងខ្ទឹមស',
        category: 'Snacks & Appetizers',
        priceUSD: 3.5,
        priceKHR: 14350,
        description: 'Golden fried handmade spring rolls served with sweet & sour chili dip.',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        isPopular: false,
        tags: ['Appetizer', 'Crispy'],
      },
    ],
  };
}

// Step 4: Account Creation / createTenant
export function createTenant(data: RegistrationFormData, options: { phoneVerified?: boolean } = {}): { success: boolean; tenant?: Tenant; error?: string } {
  const slugCheck = checkSlugAvailable(data.slug);
  if (!slugCheck.available) {
    return { success: false, error: slugCheck.reason || 'Invalid or taken URL slug' };
  }

  const tenants = getStoredTenants();
  
  // Calculate expiry date
  const isTrial = data.selectedPlan === 'trial';
  const now = new Date();
  let expiryDate = new Date();
  
  if (isTrial) {
    expiryDate.setDate(now.getDate() + 30); // 30 days trial
  } else {
    // If paid, initial status might be active or pending payment
    if (data.billingCycle === 'yearly') {
      expiryDate.setFullYear(now.getFullYear() + 1);
    } else {
      expiryDate.setMonth(now.getMonth() + 1);
    }
  }

  const starterData = generateStarterMenu(data.businessName);

  const newTenant: Tenant = {
    id: `tenant-${Date.now()}`,
    businessName: data.businessName.trim(),
    slug: data.slug.toLowerCase().trim(),
    ownerName: data.ownerName.trim(),
    phone: `${data.countryCode}${data.phone.replace(/\D/g, '')}`,
    email: data.email.toLowerCase().trim(),
    planType: data.selectedPlan,
    billingCycle: data.billingCycle,
    planExpiry: expiryDate.toISOString(),
    isTrial: isTrial,
    trialDaysRemaining: isTrial ? 30 : undefined,
    phoneVerified: options.phoneVerified ?? true,
    createdAt: now.toISOString(),
    status: 'active',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    currency: 'BOTH',
    tablesCount: 15,
    categories: starterData.categories,
    menuItems: starterData.menuItems,
  };

  tenants.push(newTenant);
  saveTenants(tenants);

  // Persist new tenant in Firestore cloud database
  try {
    const cleanPayload = sanitizeForFirestore(newTenant);
    console.log('[Firestore] Writing new tenant record to cloud...', cleanPayload);
    setDoc(doc(db, 'tenants', newTenant.id), cleanPayload)
      .then(() => {
        console.log(`[Firestore] Successfully stored tenant "${newTenant.businessName}" (${newTenant.id}) in cloud database!`);
      })
      .catch((e: any) => {
        console.error('[Firestore Error] Failed to write tenant to Firebase:', e?.code, e?.message || e);
        console.warn('Note: If you see "permission-denied" or "not-found", please enable Firestore Database in Firebase Console and set Security Rules to allow read/write.');
      });
  } catch (err: any) {
    console.error('[Firestore] Exception during write:', err?.message || err);
  }

  // Send auto notification credentials
  sendCredentialsNotification(newTenant);

  // Auto create session
  const session: UserSession = {
    tenant: newTenant,
    role: 'admin',
    token: `token-${Date.now()}`,
    loggedInAt: new Date().toISOString(),
  };
  setCurrentSession(session);

  return { success: true, tenant: newTenant };
}

// Upgrade / update tenant plan after checkout
export function updateTenantPlan(tenantSlug: string, newPlan: PlanId, billingCycle: BillingCycle): { success: boolean; tenant?: Tenant } {
  const tenants = getStoredTenants();
  const index = tenants.findIndex(t => t.slug.toLowerCase() === tenantSlug.toLowerCase());
  
  if (index === -1) {
    return { success: false };
  }

  const now = new Date();
  const expiryDate = new Date();
  if (billingCycle === 'yearly') {
    expiryDate.setFullYear(now.getFullYear() + 1);
  } else {
    expiryDate.setMonth(now.getMonth() + 1);
  }

  tenants[index] = {
    ...tenants[index],
    planType: newPlan,
    billingCycle: billingCycle,
    planExpiry: expiryDate.toISOString(),
    isTrial: false,
    trialDaysRemaining: undefined,
    status: 'active',
  };

  saveTenants(tenants);

  // Sync updated tenant to Firestore
  try {
    const cleanPayload = sanitizeForFirestore(tenants[index]);
    setDoc(doc(db, 'tenants', tenants[index].id), cleanPayload)
      .then(() => console.log(`[Firestore] Updated tenant plan in cloud for ${tenants[index].id}`))
      .catch(e => console.warn('[Firestore] Update tenant warning:', e?.message || e));
  } catch (err) {
    console.warn('[Firestore] Error:', err);
  }

  // Update current session if matching
  const currentSession = getCurrentSession();
  if (currentSession && currentSession.tenant.slug === tenantSlug) {
    setCurrentSession({
      ...currentSession,
      tenant: tenants[index],
    });
  }

  // Send updated plan receipt notification
  sendCredentialsNotification(tenants[index], 'Payment Successful - Plan Upgraded');

  return { success: true, tenant: tenants[index] };
}

// OTP Phone Verification Logic (Step 3)
export function sendOTP(phone: string, countryCode: string, method: 'sms' | 'telegram' = 'telegram', pendingData?: RegistrationFormData): OTPVerificationState {
  // Generate random 6-digit code or deterministic for easy demo testing
  const demoCode = '123456';
  const now = Date.now();
  const expiresAt = now + 3 * 60 * 1000; // 3 minutes expiration

  const otpState: OTPVerificationState = {
    phone,
    countryCode,
    method,
    code: demoCode,
    sentAt: now,
    expiresAt,
    isVerified: false,
    attempts: 0,
    pendingTenantData: pendingData,
  };

  try {
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpState));
  } catch (e) {
    console.error('Failed to save OTP state', e);
  }

  return otpState;
}

export function getOTPState(): OTPVerificationState | null {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function verifyOTP(code: string): { success: boolean; error?: string; pendingData?: RegistrationFormData } {
  const state = getOTPState();
  if (!state) {
    return { success: false, error: 'No verification session found. Please request a new code.' };
  }

  if (Date.now() > state.expiresAt) {
    return { success: false, error: 'Verification code has expired. Please resend.' };
  }

  if (code.trim() !== state.code && code.trim() !== '123456') {
    state.attempts += 1;
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(state));
    return { success: false, error: 'Incorrect verification code. (Hint: Demo code is 123456)' };
  }

  state.isVerified = true;
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(state));
  return { success: true, pendingData: state.pendingTenantData };
}

// Payment session generator (Bakong KHQR & ABA PAY)
export function createPaymentSession(tenantSlug: string, planId: PlanId, billingCycle: BillingCycle): PaymentSession {
  const plan = PLANS[planId];
  const amountUSD = billingCycle === 'yearly' ? plan.priceYearlyUSD : plan.priceMonthlyUSD;
  const amountKHR = billingCycle === 'yearly' ? plan.priceYearlyKHR : plan.priceMonthlyKHR;
  const tenant = getTenantBySlug(tenantSlug);
  const tenantName = tenant ? tenant.businessName : 'Restaurant Tenant';

  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  // Valid EMVCo format string for KHQR simulation
  const qrString = `00020101021229300016bakong@nbc.org.kh0108${transactionId}5204581253038405405${amountUSD.toFixed(2)}5802KH5913${tenantName.substring(0, 13)}6010Phnom Penh62190115${transactionId}6304A1B2`;

  const session: PaymentSession = {
    transactionId,
    tenantSlug,
    tenantName,
    plan: planId,
    billingCycle,
    amountUSD,
    amountKHR,
    qrString,
    paymentMethod: 'khqr_bakong',
    status: 'pending',
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  };

  try {
    const existingRaw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const list: PaymentSession[] = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(session);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(list.slice(0, 20)));

    // Save transaction to Firestore
    const cleanSession = sanitizeForFirestore(session);
    setDoc(doc(db, 'transactions', session.transactionId), cleanSession).catch(e => console.warn('[Firestore] Transaction log warning:', e?.message || e));
  } catch (e) {
    console.error(e);
  }

  return session;
}

// handlePaymentWebhook: Bakong / ABA callback simulation
export function handlePaymentWebhook(transactionId: string, tenantSlug: string, planId: PlanId, billingCycle: BillingCycle): { success: boolean; tenant?: Tenant } {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (raw) {
      const list: PaymentSession[] = JSON.parse(raw);
      const target = list.find(t => t.transactionId === transactionId);
      if (target) {
        target.status = 'completed';
        localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(list));
      }
    }
  } catch (e) {
    console.error(e);
  }

  return updateTenantPlan(tenantSlug, planId, billingCycle);
}

// Dispatch email & Telegram notification with menu link and admin login link
export function sendCredentialsNotification(tenant: Tenant, customSubject?: string): NotificationLog[] {
  const origin = window.location.origin;
  const menuLink = `${origin}/menu/${tenant.slug}`;
  const adminLink = 'https://comfortable-achievement-production-fccf.up.railway.app/';

  const isTrial = tenant.planType === 'trial';
  const planDetails = isTrial ? '30-Day Full Access Free Trial' : `${tenant.planType.toUpperCase()} Plan (${tenant.billingCycle})`;

  const emailSubject = customSubject || `Welcome to SmartMenu! Your Account is Ready (${tenant.businessName})`;
  const messageBody = `Hello ${tenant.ownerName},\n\nCongratulations! Your restaurant account for "${tenant.businessName}" has been successfully provisioned.\n\n🔐 Admin Portal Login:\n${adminLink}\n\nSubscription Plan: ${planDetails}\nExpiry Date: ${new Date(tenant.planExpiry).toLocaleDateString()}\n\nThank you for choosing SmartMenu!`;

  const logs: NotificationLog[] = [
    {
      id: `notif-tg-${Date.now()}`,
      recipient: tenant.phone || tenant.telegramChatId || 'Telegram Bot',
      type: 'telegram',
      subject: emailSubject,
      message: messageBody,
      sentAt: new Date().toISOString(),
      menuLink,
      adminLink,
    },
    {
      id: `notif-em-${Date.now() + 1}`,
      recipient: tenant.email,
      type: 'email',
      subject: emailSubject,
      message: messageBody,
      sentAt: new Date().toISOString(),
      menuLink,
      adminLink,
    },
  ];

  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const current: NotificationLog[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([...logs, ...current].slice(0, 30)));

    // Sync notification logs to Firestore
    logs.forEach(l => {
      const cleanLog = sanitizeForFirestore(l);
      setDoc(doc(db, 'notifications', l.id), cleanLog).catch(e => console.warn('[Firestore] Notification log warning:', e?.message || e));
    });
  } catch (e) {
    console.error(e);
  }

  return logs;
}

export function getNotifications(): NotificationLog[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// User Session Management
export function getCurrentSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCurrentSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

export function loginTenant(identifier: string, pass: string, role: UserRole = 'admin'): { success: boolean; session?: UserSession; error?: string } {
  const tenants = getStoredTenants();
  const cleanId = identifier.toLowerCase().trim();

  // Find tenant by email, phone, or slug
  const tenant = tenants.find(t => 
    t.email.toLowerCase() === cleanId || 
    t.slug.toLowerCase() === cleanId ||
    t.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
  );

  if (!tenant) {
    return { success: false, error: 'No account found with this email, phone, or shop URL.' };
  }

  // Any password of at least 6 chars accepted for seamless demo or check exact
  if (pass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const session: UserSession = {
    tenant,
    role,
    token: `auth-${Date.now()}-${tenant.id}`,
    loggedInAt: new Date().toISOString(),
  };

  setCurrentSession(session);
  return { success: true, session };
}

export function logoutTenant(): void {
  setCurrentSession(null);
}

// Dish management helpers for tenant admin
export function addMenuItem(tenantId: string, item: Omit<MenuItem, 'id'>): Tenant | null {
  const tenants = getStoredTenants();
  const index = tenants.findIndex(t => t.id === tenantId);
  if (index === -1) return null;

  const newItem: MenuItem = {
    ...item,
    id: `item-${Date.now()}`,
  };

  tenants[index].menuItems.unshift(newItem);
  if (!tenants[index].categories.includes(item.category)) {
    tenants[index].categories.push(item.category);
  }

  saveTenants(tenants);

  // Sync to Firestore
  try {
    const cleanPayload = sanitizeForFirestore(tenants[index]);
    setDoc(doc(db, 'tenants', tenants[index].id), cleanPayload).catch(e => console.warn('[Firestore] Update warning:', e?.message || e));
  } catch (err) {
    console.warn('[Firestore] Error:', err);
  }
  
  const current = getCurrentSession();
  if (current && current.tenant.id === tenantId) {
    setCurrentSession({ ...current, tenant: tenants[index] });
  }

  return tenants[index];
}

export function toggleItemAvailability(tenantId: string, itemId: string): Tenant | null {
  const tenants = getStoredTenants();
  const index = tenants.findIndex(t => t.id === tenantId);
  if (index === -1) return null;

  tenants[index].menuItems = tenants[index].menuItems.map(item => 
    item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
  );

  saveTenants(tenants);

  // Sync to Firestore
  try {
    const cleanPayload = sanitizeForFirestore(tenants[index]);
    setDoc(doc(db, 'tenants', tenants[index].id), cleanPayload).catch(e => console.warn('[Firestore] Update warning:', e?.message || e));
  } catch (err) {
    console.warn('[Firestore] Error:', err);
  }

  const current = getCurrentSession();
  if (current && current.tenant.id === tenantId) {
    setCurrentSession({ ...current, tenant: tenants[index] });
  }

  return tenants[index];
}
