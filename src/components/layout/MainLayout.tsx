
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  PlaySquare, 
  GamepadIcon, 
  ShoppingBag, 
  Cookie, 
  Lock, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [pathname]);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Netflix", href: "/accounts/netflix", icon: PlaySquare },
    { name: "Crunchyroll", href: "/accounts/crunchyroll", icon: PlaySquare },
    { name: "Steam", href: "/accounts/steam", icon: GamepadIcon },
    { name: "Amazon Prime", href: "/accounts/amazon", icon: ShoppingBag },
    { name: "Netflix Cookies", href: "/cookies", icon: Cookie },
    { name: "Admin", href: "/admin", icon: Lock },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
