
import { toast } from "sonner";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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

// Convert Firestore document to Account
const documentToAccount = (doc: any): Account => {
  const data = doc.data();
  return {
    id: doc.id,
    service: data.service,
    email: data.email,
    password: data.password,
    status: data.status,
    lastUsed: data.lastUsed ? data.lastUsed.toDate().toISOString() : null,
    addedOn: data.addedOn.toDate().toISOString(),
    expiresOn: data.expiresOn ? data.expiresOn.toDate().toISOString() : null,
    usageCount: data.usageCount || 0,
  };
};

// Convert Firestore document to Cookie
const documentToCookie = (doc: any): Cookie => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    value: data.value,
    domain: data.domain,
    addedOn: data.addedOn.toDate().toISOString(),
    expiresOn: data.expiresOn ? data.expiresOn.toDate().toISOString() : null,
    status: data.status,
  };
};

// API functions
export const getAccountsByService = async (
  service: string
): Promise<Account[]> => {
  try {
    const q = query(
      collection(db, "accounts"), 
      where("service", "==", service),
      where("status", "!=", "expired")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(documentToAccount);
  } catch (error) {
    console.error("Error getting accounts by service:", error);
    toast.error("Failed to fetch accounts");
    return [];
  }
};

export const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "accounts"));
    return querySnapshot.docs.map(documentToAccount);
  } catch (error) {
    console.error("Error getting all accounts:", error);
    toast.error("Failed to fetch accounts");
    return [];
  }
};

export const getAllCookies = async (): Promise<Cookie[]> => {
  try {
    const q = query(
      collection(db, "cookies"),
      where("status", "!=", "expired")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(documentToCookie);
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

    const accountRef = doc(db, "accounts", id);
    const accountDoc = await getDocs(query(collection(db, "accounts"), where("__name__", "==", id)));
    
    if (accountDoc.empty) {
      toast.error("Account not found");
      return null;
    }
    
    const account = documentToAccount(accountDoc.docs[0]);
    
    // Update account usage
    await updateDoc(accountRef, {
      lastUsed: serverTimestamp(),
      usageCount: (account.usageCount || 0) + 1,
    });
    
    // Track the claim
    addUserClaim();
    
    toast.success("Account claimed successfully!");
    
    // Return updated account
    return {
      ...account,
      lastUsed: new Date().toISOString(),
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
    const docRef = await addDoc(collection(db, "accounts"), {
      ...account,
      addedOn: serverTimestamp(),
      lastUsed: null,
      usageCount: 0,
      expiresOn: account.expiresOn ? Timestamp.fromDate(new Date(account.expiresOn)) : null,
    });
    
    toast.success("Account added successfully!");
    
    return {
      id: docRef.id,
      ...account,
      addedOn: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0,
    };
  } catch (error) {
    console.error("Error adding account:", error);
    toast.error("Failed to add account");
    throw error;
  }
};

export const updateAccount = async (id: string, updates: Partial<Account>): Promise<Account | null> => {
  try {
    const accountRef = doc(db, "accounts", id);
    
    // Convert date strings to Firestore timestamps
    const firestoreUpdates: any = { ...updates };
    if (updates.expiresOn) {
      firestoreUpdates.expiresOn = Timestamp.fromDate(new Date(updates.expiresOn));
    }
    
    await updateDoc(accountRef, firestoreUpdates);
    
    toast.success("Account updated successfully!");
    
    // Fetch the updated account
    const accountDoc = await getDocs(query(collection(db, "accounts"), where("__name__", "==", id)));
    if (accountDoc.empty) {
      return null;
    }
    
    return documentToAccount(accountDoc.docs[0]);
  } catch (error) {
    console.error("Error updating account:", error);
    toast.error("Failed to update account");
    return null;
  }
};

export const deleteAccount = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "accounts", id));
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
    const docRef = await addDoc(collection(db, "cookies"), {
      ...cookie,
      addedOn: serverTimestamp(),
      expiresOn: cookie.expiresOn ? Timestamp.fromDate(new Date(cookie.expiresOn)) : null,
    });
    
    toast.success("Cookie added successfully!");
    
    return {
      id: docRef.id,
      ...cookie,
      addedOn: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding cookie:", error);
    toast.error("Failed to add cookie");
    throw error;
  }
};

export const deleteCookie = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "cookies", id));
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
    const docRef = await addDoc(collection(db, "serviceRequests"), {
      ...request,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    
    toast.success("Service request submitted successfully!");
    
    return {
      id: docRef.id,
      ...request,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error submitting service request:", error);
    toast.error("Failed to submit service request");
    throw error;
  }
};

export const getAllServiceRequests = async (): Promise<ServiceRequest[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "serviceRequests"));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        service: data.service,
        plan: data.plan,
        reason: data.reason,
        status: data.status,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
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
    await updateDoc(doc(db, "serviceRequests", id), { status });
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
