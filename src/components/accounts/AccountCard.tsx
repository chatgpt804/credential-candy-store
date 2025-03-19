import { useState } from "react";
import { Account, Game, claimAccount } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Copy, CheckCircle, Clock, AlertTriangle, Gamepad } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface AccountCardProps {
  account: Account;
  onUpdate?: () => void;
}

const getPlanName = (service: string, planId: string): string => {
  const planMappings: Record<string, Record<string, string>> = {
    netflix: {
      basic: "Basic Plan",
      standard: "Standard Plan",
      premium: "Premium Plan"
    },
    crunchyroll: {
      free: "Free Plan",
      fan: "Fan Plan",
      mega_fan: "Mega Fan Plan",
      ultimate_fan: "Ultimate Fan Plan"
    },
    steam: {
      steam_standard: "Standard Account"
    },
    amazon: {
      monthly: "Monthly Plan",
      annual: "Annual Plan",
      video_only: "Video Only Plan"
    }
  };

  return planMappings[service]?.[planId] || planId;
};

const AccountCard = ({ account, onUpdate }: AccountCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const statusIcon = {
    active: <CheckCircle className="h-4 w-4 text-green-500" />,
    expiring: <Clock className="h-4 w-4 text-amber-500" />,
    expired: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  const statusText = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired",
  };

  const handleClaim = async () => {
    setIsLoading(true);
    const updatedAccount = await claimAccount(account.id);
    setIsLoading(false);
    
    if (updatedAccount && onUpdate) {
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {statusIcon[account.status]}
            <span className="font-medium">{statusText[account.status]}</span>
          </div>
          {account.plan && (
            <Badge variant="secondary">
              {getPlanName(account.service, account.plan)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground mb-1">Login Details</div>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => copyToClipboard(`${account.email}:${account.password}`)}
                  >
                    {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Copy credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-secondary/50 rounded-md p-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span>Username:</span>
              <span className="font-semibold">{account.email}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Password:</span>
              <span className="font-semibold">{account.password}</span>
            </div>
          </div>

          {/* Games list for Steam accounts */}
          {account.service === 'steam' && account.games && account.games.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Gamepad className="h-4 w-4 mr-1" />
                <span>Included Games</span>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <ul className="space-y-2 text-sm">
                  {account.games.map((game) => (
                    <li key={game.id} className="flex items-start">
                      <div>
                        <div className="font-medium">{game.name}</div>
                        {game.description && (
                          <div className="text-xs text-muted-foreground">{game.description}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Added:</span>
            <span>{new Date(account.addedOn).toLocaleDateString()}</span>
          </div>
          {account.expiresOn && (
            <div className="flex justify-between">
              <span>Expires:</span>
              <span>{new Date(account.expiresOn).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Claims:</span>
            <span>{account.usageCount}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleClaim}
          disabled={isLoading || account.status === "expired"}
        >
          {isLoading ? "Processing..." : "Claim Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
