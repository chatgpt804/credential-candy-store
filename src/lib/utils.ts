
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string, message: string = "Copied to clipboard") {
  navigator.clipboard.writeText(text).then(
    () => {
      toast.success(message);
    },
    (err) => {
      console.error("Could not copy text: ", err);
      toast.error("Failed to copy to clipboard");
    }
  );
}

export function formatDate(date: string | null): string {
  if (!date) return "N/A";
  
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getRelativeTimeString(
  date: string | null,
  lang = navigator.language
): string {
  if (!date) return "N/A";
  
  const timeMs = new Date(date).getTime();
  
  // Get seconds between now and the date
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  
  // Array with the units and their conversions in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];
  
  // Find the appropriate unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function getExpirationStatusClass(expiresOn: string | null): string {
  if (!expiresOn) return "status-badge unavailable";
  
  const expirationDate = new Date(expiresOn).getTime();
  const now = Date.now();
  const daysUntilExpiration = (expirationDate - now) / (1000 * 60 * 60 * 24);
  
  if (daysUntilExpiration < 0) return "status-badge unavailable";
  if (daysUntilExpiration < 7) return "status-badge limited";
  return "status-badge available";
}

export function generateMaskedDisplay(email: string): string {
  if (!email.includes("@")) return email;
  
  const [username, domain] = email.split("@");
  const maskedUsername = username.substring(0, 3) + "•••";
  return `${maskedUsername}@${domain}`;
}
