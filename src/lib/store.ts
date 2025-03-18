
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  plan?: string;
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

// User rate limiting with local storage
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

// Convert Supabase response to Account
const supabaseToAccount = (item: any): Account => {
  return {
    id: item.id,
    service: item.service,
    email: item.email,
    password: item.password,
    status: item.status as "active" | "expiring" | "expired",
    lastUsed: item.last_used ? new Date(item.last_used).toISOString() : null,
    addedOn: new Date(item.added_on).toISOString(),
    expiresOn: item.expires_on ? new Date(item.expires_on).toISOString() : null,
    usageCount: item.usage_count || 0,
    plan: item.plan || null,
  };
};

// Convert Supabase response to Cookie
const supabaseToCookie = (item: any): Cookie => {
  return {
    id: item.id,
    name: item.name,
    value: item.value,
    domain: item.domain,
    addedOn: new Date(item.added_on).toISOString(),
    expiresOn: item.expires_on ? new Date(item.expires_on).toISOString() : null,
    status: item.status as "active" | "expiring" | "expired",
  };
};

// API functions
export const getAccountsByService = async (
  service: string
): Promise<Account[]> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('service', service)
      .neq('status', 'expired');
    
    if (error) throw error;
    return data ? data.map(supabaseToAccount) : [];
  } catch (error) {
    console.error("Error getting accounts by service:", error);
    toast.error("Failed to fetch accounts");
    return [];
  }
};

export const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');
    
    if (error) throw error;
    return data ? data.map(supabaseToAccount) : [];
  } catch (error) {
    console.error("Error getting all accounts:", error);
    toast.error("Failed to fetch accounts");
    return [];
  }
};

export const getAllCookies = async (): Promise<Cookie[]> => {
  try {
    const { data, error } = await supabase
      .from('cookies')
      .select('*')
      .neq('status', 'expired');
    
    if (error) throw error;
    return data ? data.map(supabaseToCookie) : [];
  } catch (error) {
    console.error("Error getting all cookies:", error);
    toast.error("Failed to fetch cookies");
    return [];
  }
};

export const claimAccount = async (id: string): Promise<Account | null> => {
  try {
    if (!canUserClaim()) {
      toast.error(
        `You can only claim one account every ${CLAIM_LIMIT_HOURS} hours.`
      );
      return null;
    }

    // First get the account
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (accountError) throw accountError;
    if (!accountData) {
      toast.error("Account not found");
      return null;
    }
    
    const account = supabaseToAccount(accountData);
    
    // Update account usage
    const now = new Date();
    const { error: updateError } = await supabase
      .from('accounts')
      .update({
        last_used: now.toISOString(),
        usage_count: (account.usageCount || 0) + 1
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Track the claim
    addUserClaim();
    
    toast.success("Account claimed successfully!");
    
    // Return updated account
    return {
      ...account,
      lastUsed: now.toISOString(),
      usageCount: account.usageCount + 1,
    };
  } catch (error) {
    console.error("Error claiming account:", error);
    toast.error("Failed to claim account");
    return null;
  }
};

export const addAccount = async (account: Omit<Account, "id" | "addedOn" | "lastUsed" | "usageCount">): Promise<Account> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        service: account.service,
        email: account.email,
        password: account.password,
        status: account.status,
        expires_on: account.expiresOn ? new Date(account.expiresOn).toISOString() : null,
        plan: account.plan || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Account added successfully!");
    
    return supabaseToAccount(data);
  } catch (error) {
    console.error("Error adding account:", error);
    toast.error("Failed to add account");
    throw error;
  }
};

export const updateAccount = async (id: string, updates: Partial<Account>): Promise<Account | null> => {
  try {
    const updateData: any = {};
    
    if (updates.service) updateData.service = updates.service;
    if (updates.email) updateData.email = updates.email;
    if (updates.password) updateData.password = updates.password;
    if (updates.status) updateData.status = updates.status;
    if (updates.expiresOn) updateData.expires_on = new Date(updates.expiresOn).toISOString();
    if (updates.plan) updateData.plan = updates.plan;
    
    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Account updated successfully!");
    
    return supabaseToAccount(data);
  } catch (error) {
    console.error("Error updating account:", error);
    toast.error("Failed to update account");
    return null;
  }
};

export const deleteAccount = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("Account deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    toast.error("Failed to delete account");
    return false;
  }
};

export const addCookie = async (cookie: Omit<Cookie, "id" | "addedOn">): Promise<Cookie> => {
  try {
    const { data, error } = await supabase
      .from('cookies')
      .insert({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        status: cookie.status,
        expires_on: cookie.expiresOn ? new Date(cookie.expiresOn).toISOString() : null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Cookie added successfully!");
    
    return supabaseToCookie(data);
  } catch (error) {
    console.error("Error adding cookie:", error);
    toast.error("Failed to add cookie");
    throw error;
  }
};

export const deleteCookie = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cookies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("Cookie deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting cookie:", error);
    toast.error("Failed to delete cookie");
    return false;
  }
};

// Service request functionality
export interface ServiceRequest {
  id: string;
  email: string;
  service: string;
  plan: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const submitServiceRequest = async (
  request: Omit<ServiceRequest, "id" | "status" | "createdAt">
): Promise<ServiceRequest> => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        email: request.email,
        service: request.service,
        plan: request.plan,
        reason: request.reason,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Service request submitted successfully!");
    
    return {
      id: data.id,
      email: data.email,
      service: data.service,
      plan: data.plan,
      reason: data.reason,
      status: data.status as "pending" | "approved" | "rejected",
      createdAt: new Date(data.created_at).toISOString(),
    };
  } catch (error) {
    console.error("Error submitting service request:", error);
    toast.error("Failed to submit service request");
    throw error;
  }
};

export const getAllServiceRequests = async (): Promise<ServiceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*');
    
    if (error) throw error;
    
    return data ? data.map(item => ({
      id: item.id,
      email: item.email,
      service: item.service,
      plan: item.plan,
      reason: item.reason,
      status: item.status as "pending" | "approved" | "rejected",
      createdAt: new Date(item.created_at).toISOString(),
    })) : [];
  } catch (error) {
    console.error("Error getting service requests:", error);
    toast.error("Failed to fetch service requests");
    return [];
  }
};

export const updateServiceRequestStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Service request ${status}`);
    return true;
  } catch (error) {
    console.error("Error updating service request:", error);
    toast.error("Failed to update service request");
    return false;
  }
};

// Admin authentication
export const ADMIN_KEY = "admin123";

export const verifyAdminKey = (key: string): boolean => {
  return key === ADMIN_KEY;
};
