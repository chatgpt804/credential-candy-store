
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import AccountCard from "@/components/accounts/AccountCard";
import { getAccountsByService } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaySquare, Gamepad, ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const serviceDetails = {
  netflix: {
    name: "Netflix",
    icon: PlaySquare,
    color: "text-red-500",
    description: "Access premium Netflix accounts with HD & 4K streaming capabilities.",
    features: [
      "Full HD & 4K streaming",
      "Multiple profiles per account",
      "Access to all Netflix originals",
      "Watch on any device"
    ]
  },
  crunchyroll: {
    name: "Crunchyroll",
    icon: PlaySquare,
    color: "text-orange-500",
    description: "Enjoy premium anime streaming with an ad-free experience on Crunchyroll.",
    features: [
      "Ad-free anime streaming",
      "New episodes one hour after Japan",
      "Access to entire catalog",
      "Simultaneous device streaming"
    ]
  },
  steam: {
    name: "Steam",
    icon: Gamepad,
    color: "text-blue-500",
    description: "Get access to premium Steam accounts with popular games and features.",
    features: [
      "Access to purchased games",
      "Cloud saves across devices",
      "Steam community features",
      "Automatic game updates"
    ]
  },
  amazon: {
    name: "Amazon Prime",
    icon: ShoppingBag,
    color: "text-cyan-500",
    description: "Enjoy Amazon Prime Video streaming, free shipping and more.",
    features: [
      "Prime Video streaming",
      "Free 2-day shipping",
      "Prime Reading",
      "Prime Music"
    ]
  }
};

const AccountsPage = () => {
  const { service } = useParams<{ service: string }>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Handle invalid service parameter
  if (!service || !Object.keys(serviceDetails).includes(service)) {
    return <Navigate to="/" />;
  }

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts", service, refreshKey],
    queryFn: () => getAccountsByService(service),
  });

  const handleAccountUpdate = () => {
    // Force refresh of the query
    setRefreshKey(prev => prev + 1);
  };

  const ServiceIcon = serviceDetails[service as keyof typeof serviceDetails].icon;

  // Filter accounts based on search term if it's the Steam service
  const filteredAccounts = accounts ? accounts.filter(account => {
    if (service !== 'steam' || !searchTerm) return true;
    
    return account.games?.some(game => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex flex-col items-center text-center mb-16">
          <div className={`p-4 rounded-full bg-secondary w-14 h-14 flex items-center justify-center mb-4`}>
            <ServiceIcon className={`h-6 w-6 ${serviceDetails[service as keyof typeof serviceDetails].color}`} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {serviceDetails[service as keyof typeof serviceDetails].name} Accounts
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {serviceDetails[service as keyof typeof serviceDetails].description}
          </p>
        </div>

        <div className="bg-secondary/50 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-medium mb-4">Features & Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {serviceDetails[service as keyof typeof serviceDetails].features.map((feature, index) => (
              <div key={index} className="bg-background rounded-xl p-4 shadow-subtle">
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar for Steam accounts only */}
        {service === 'steam' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by game name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-medium mb-6">Available Accounts</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="service-card space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">Error loading accounts. Please try again later.</p>
          </div>
        ) : filteredAccounts && filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} onUpdate={handleAccountUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {searchTerm && service === 'steam' 
                ? "No accounts found with that game. Please try a different search term."
                : "No accounts available at the moment. Please check back later."}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AccountsPage;
