
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import CookieCard from "@/components/cookies/CookieCard";
import { getAllCookies } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Cookie, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CookiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: cookies, isLoading, error } = useQuery({
    queryKey: ["cookies", refreshKey],
    queryFn: getAllCookies,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-4 rounded-full bg-secondary w-14 h-14 flex items-center justify-center mb-4">
            <Cookie className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Netflix Cookies
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Access Netflix premium features instantly by adding these cookies to your browser.
            No email or password required.
          </p>
        </div>

        <div className="bg-secondary/50 rounded-2xl p-6 mb-12">
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-xl font-medium">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  How to Use Netflix Cookies
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground space-y-4 mt-2">
                  <div className="bg-background rounded-xl p-4 shadow-subtle">
                    <h3 className="font-medium mb-2">1. Install a cookie editor extension</h3>
                    <p className="text-sm">
                      Download and install a cookie editor extension for your browser like "EditThisCookie" for Chrome or "Cookie Editor" for Firefox.
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 shadow-subtle">
                    <h3 className="font-medium mb-2">2. Go to Netflix.com</h3>
                    <p className="text-sm">
                      Navigate to the Netflix website but don't log in.
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 shadow-subtle">
                    <h3 className="font-medium mb-2">3. Open the cookie editor</h3>
                    <p className="text-sm">
                      Click on the cookie editor extension icon in your browser toolbar.
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 shadow-subtle">
                    <h3 className="font-medium mb-2">4. Add the cookie</h3>
                    <p className="text-sm">
                      Copy the cookie value, add a new cookie with the same name and domain, paste the value, and save.
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 shadow-subtle">
                    <h3 className="font-medium mb-2">5. Refresh the page</h3>
                    <p className="text-sm">
                      Refresh Netflix and you should be automatically logged in to the premium account.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <h2 className="text-2xl font-medium mb-6">Available Cookies</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="service-card space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">Error loading cookies. Please try again later.</p>
          </div>
        ) : cookies && cookies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cookies.map((cookie) => (
              <CookieCard key={cookie.id} cookie={cookie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No cookies available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CookiesPage;
