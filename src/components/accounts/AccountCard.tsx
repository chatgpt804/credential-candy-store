
import { useState } from "react";
import { Account, claimAccount } from "@/lib/store";
import { copyToClipboard, formatDate, getExpirationStatusClass, generateMaskedDisplay } from "@/lib/utils";
import { CheckCircle, Copy, EyeIcon, EyeOffIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  account: Account;
  isAdmin?: boolean;
  onUpdate?: () => void;
}

const AccountCard = ({ account, isAdmin = false, onUpdate }: AccountCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  const handleCopyEmail = () => {
    copyToClipboard(account.email, "Email copied to clipboard");
  };

  const handleCopyPassword = () => {
    copyToClipboard(account.password, "Password copied to clipboard");
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await claimAccount(account.id);
      if (onUpdate) onUpdate();
    } finally {
      setIsClaiming(false);
    }
  };

  const displayEmail = isRevealed ? account.email : generateMaskedDisplay(account.email);
  const displayPassword = isRevealed ? account.password : "••••••••••";

  // Define plan display names
  const getPlanDisplayName = () => {
    if (!account.plan) return null;
    
    const planNames: Record<string, string> = {
      // Netflix plans
      "basic": "Basic Plan",
      "standard": "Standard Plan",
      "premium": "Premium Plan",
      // Crunchyroll plans
      "free": "Free Plan",
      "fan": "Fan",
      "mega_fan": "Mega Fan",
      "ultimate_fan": "Ultimate Fan",
      // Amazon plans
      "monthly": "Monthly",
      "annual": "Annual",
      "video_only": "Video Only",
      // Steam plans - using different name to avoid duplication
      "steam_standard": "Standard Account"
    };
    
    return planNames[account.plan] || account.plan;
  };

  const planDisplayName = getPlanDisplayName();

  return (
    <div className="service-card animate-scale-in group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className={getExpirationStatusClass(account.expiresOn)}>
            {account.status === "active" && "Active"}
            {account.status === "expiring" && "Expiring Soon"}
            {account.status === "expired" && "Expired"}
          </div>
          <h3 className="text-lg font-medium mt-2">{displayEmail}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleReveal}
          className="text-muted-foreground hover:text-foreground">
          {isRevealed ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Password:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{displayPassword}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyPassword}
              className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Copy size={16} />
            </Button>
          </div>
        </div>

        {planDisplayName && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan:</span>
            <span className="text-sm font-medium">{planDisplayName}</span>
          </div>
        )}

        {isAdmin && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Used:</span>
            <span className="text-sm">{account.usageCount} times</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Added:</span>
          <span className="text-sm">{formatDate(account.addedOn)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Expires:</span>
          <span className="text-sm">{formatDate(account.expiresOn)}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t">
        <Button
          className="w-full gap-2 group-hover:bg-primary/90"
          onClick={handleClaim}
          disabled={isClaiming}
        >
          {isClaiming ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Claim Account
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AccountCard;
