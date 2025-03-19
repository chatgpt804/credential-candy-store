import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  PlaySquare, 
  GamepadIcon, 
  ShoppingBag, 
  Cookie, 
  LogOut,
  LogIn,
  User,
  Menu, 
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);

    // Get current user
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setEmail(data.user.email);
      }
    };
    
    getCurrentUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setEmail(session?.user?.email || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  // Updated navigation items - removed Admin link
  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Netflix", href: "/accounts/netflix", icon: PlaySquare },
    { name: "Crunchyroll", href: "/accounts/crunchyroll", icon: PlaySquare },
    { name: "Steam", href: "/accounts/steam", icon: GamepadIcon },
    { name: "Amazon Prime", href: "/accounts/amazon", icon: ShoppingBag },
    { name: "Netflix Cookies", href: "/cookies", icon: Cookie },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">Credential Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary" />
                )}
                <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User size={16} />
                    <span className="max-w-[120px] truncate">{email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="gap-2">
                <LogIn size={16} />
                <span>Sign in</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background animate-fade-in pt-16">
          <nav className="container py-6 flex flex-col space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-4 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth Actions */}
            <div className="pt-4 border-t">
              {email ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Signed in as: <span className="font-medium text-foreground">{email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-4 rounded-md transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-3 px-3 py-4 rounded-md transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Credential Store. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
