
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="page-container flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button size="lg" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
