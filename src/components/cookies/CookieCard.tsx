
import { useState } from "react";
import { Cookie } from "@/lib/store";
import { copyToClipboard, formatDate, getExpirationStatusClass } from "@/lib/utils";
import { Copy, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookieCardProps {
  cookie: Cookie;
  isAdmin?: boolean;
}

const CookieCard = ({ cookie, isAdmin = false }: CookieCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  const handleCopyValue = () => {
    copyToClipboard(cookie.value, "Cookie value copied to clipboard");
  };

  const displayValue = isRevealed 
    ? cookie.value 
    : cookie.value.substring(0, 4) + "••••••••••" + cookie.value.substring(cookie.value.length - 4);

  return (
    <div className="service-card animate-scale-in group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className={getExpirationStatusClass(cookie.expiresOn)}>
            {cookie.status === "active" && "Active"}
            {cookie.status === "expiring" && "Expiring Soon"}
            {cookie.status === "expired" && "Expired"}
          </div>
          <h3 className="text-lg font-medium mt-2">{cookie.name}</h3>
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
          <span className="text-sm text-muted-foreground">Domain:</span>
          <span className="text-sm">{cookie.domain}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Added:</span>
          <span className="text-sm">{formatDate(cookie.addedOn)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Expires:</span>
          <span className="text-sm">{formatDate(cookie.expiresOn)}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden bg-secondary/50 rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Value:</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyValue}
            className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Copy size={16} />
          </Button>
        </div>
        <div className="font-mono text-xs break-all">{displayValue}</div>
      </div>
    </div>
  );
};

export default CookieCard;
