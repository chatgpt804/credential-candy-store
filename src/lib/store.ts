
// This is a mock data store that simulates fetching from a database
// In a real application, this would be replaced with API calls

import { toast } from "sonner";

export interface Account {
  id: string;
  service: string;
  email: string;
  password: string;
  status: "active" | "expiring" | "expired";
  lastUsed: string | null;
  addedOn: string;
  expiresOn: string | null;
  usageCount: number;
}

export interface Cookie {
  id: string;
  name: string;
  value: string;
  domain: string;
  addedOn: string;
  expiresOn: string | null;
  status: "active" | "expiring" | "expired";
}

// Initial mock data
let accounts: Account[] = [
  {
    id: "1",
    service: "netflix",
    email: "premium1@example.com",
    password: "securepass123",
    status: "active",
    lastUsed: null,
    addedOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
  },
  {
    id: "2",
    service: "netflix",
    email: "premium2@example.com",
    password: "netflixpass456",
    status: "active",
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    addedOn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 3,
  },
  {
    id: "3",
    service: "crunchyroll",
    email: "anime1@example.com",
    password: "animepass123",
    status: "active",
    lastUsed: null,
    addedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
  },
  {
    id: "4",
    service: "steam",
    email: "gamer1@example.com",
    password: "steampass123",
    status: "expiring",
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    addedOn: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 2,
  },
  {
    id: "5",
    service: "amazon",
    email: "prime1@example.com",
    password: "primepass123",
    status: "active",
    lastUsed: null,
    addedOn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
  },
  {
    id: "6",
    service: "amazon",
    email: "prime2@example.com",
    password: "amazonpass456",
    status: "expired",
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    addedOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 5,
  },
];

let cookies: Cookie[] = [
  {
    id: "1",
    name: "NetflixId",
    value: "cl2x42fs9mze04k3ntexmpl",
    domain: ".netflix.com",
    addedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "2",
    name: "NetflixSecure",
    value: "v2x94jfgt745jk86ntexmpl",
    domain: ".netflix.com",
    addedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "3",
    name: "NetflixSession",
    value: "b4m67pts30vz28k9ntexmpl",
    domain: ".netflix.com",
    addedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresOn: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "expiring",
  },
];

// Simulate user rate limiting with local storage
const USER_CLAIM_KEY = "user_claim_timestamps";
const CLAIM_LIMIT_HOURS = 12; // Hours between claims

const getUserClaimHistory = (): number[] => {
  const stored = localStorage.getItem(USER_CLAIM_KEY);
  return stored ? JSON.parse(stored) : [];
};

const addUserClaim = (): void => {
  const claims = getUserClaimHistory();
  claims.push(Date.now());
  localStorage.setItem(USER_CLAIM_KEY, JSON.stringify(claims));
};

const canUserClaim = (): boolean => {
  const claims = getUserClaimHistory();
  const hourInMs = CLAIM_LIMIT_HOURS * 60 * 60 * 1000;
  const recentClaims = claims.filter(
    (timestamp) => Date.now() - timestamp < hourInMs
  );
  return recentClaims.length === 0;
};

// API functions
export const getAccountsByService = async (
  service: string
): Promise<Account[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return accounts.filter(
    (account) => account.service === service && account.status !== "expired"
  );
};

export const getAllAccounts = async (): Promise<Account[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...accounts];
};

export const getAllCookies = async (): Promise<Cookie[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return cookies.filter((cookie) => cookie.status !== "expired");
};

export const claimAccount = async (id: string): Promise<Account | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!canUserClaim()) {
    toast.error(
      `You can only claim one account every ${CLAIM_LIMIT_HOURS} hours.`
    );
    return null;
  }

  const accountIndex = accounts.findIndex((a) => a.id === id);
  if (accountIndex === -1) {
    toast.error("Account not found");
    return null;
  }

  const account = { ...accounts[accountIndex] };
  
  // Update account usage
  account.lastUsed = new Date().toISOString();
  account.usageCount += 1;
  
  // Update in our "database"
  accounts[accountIndex] = account;
  
  // Track the claim
  addUserClaim();
  
  toast.success("Account claimed successfully!");
  return account;
};

export const addAccount = async (account: Omit<Account, "id" | "addedOn" | "lastUsed" | "usageCount">): Promise<Account> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const newAccount: Account = {
    ...account,
    id: Math.random().toString(36).substring(2, 9),
    addedOn: new Date().toISOString(),
    lastUsed: null,
    usageCount: 0,
  };
  
  accounts = [...accounts, newAccount];
  toast.success("Account added successfully!");
  return newAccount;
};

export const updateAccount = async (id: string, updates: Partial<Account>): Promise<Account | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const accountIndex = accounts.findIndex((a) => a.id === id);
  if (accountIndex === -1) {
    toast.error("Account not found");
    return null;
  }
  
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    ...updates,
  };
  
  toast.success("Account updated successfully!");
  return accounts[accountIndex];
};

export const deleteAccount = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const accountIndex = accounts.findIndex((a) => a.id === id);
  if (accountIndex === -1) {
    toast.error("Account not found");
    return false;
  }
  
  accounts = accounts.filter((a) => a.id !== id);
  toast.success("Account deleted successfully!");
  return true;
};

export const addCookie = async (cookie: Omit<Cookie, "id" | "addedOn">): Promise<Cookie> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const newCookie: Cookie = {
    ...cookie,
    id: Math.random().toString(36).substring(2, 9),
    addedOn: new Date().toISOString(),
  };
  
  cookies = [...cookies, newCookie];
  toast.success("Cookie added successfully!");
  return newCookie;
};

export const deleteCookie = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const cookieIndex = cookies.findIndex((c) => c.id === id);
  if (cookieIndex === -1) {
    toast.error("Cookie not found");
    return false;
  }
  
  cookies = cookies.filter((c) => c.id !== id);
  toast.success("Cookie deleted successfully!");
  return true;
};

// Admin authentication (simple for demo purposes)
export const ADMIN_KEY = "admin123"; // In a real app, this would never be hardcoded

export const verifyAdminKey = (key: string): boolean => {
  return key === ADMIN_KEY;
};
