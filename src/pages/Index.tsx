import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { Button } from "@/components/ui/button";
import { 
  PlaySquare, 
  GamepadIcon, 
  ShoppingBag,
  Cookie,
  ShieldCheck,
  RefreshCw,
  Copy,
  Clock,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const serviceCards = [
    {
      id: "netflix",
      name: "Netflix",
      icon: PlaySquare,
      description: "Access premium Netflix accounts with HD & 4K streaming",
      color: "bg-red-500/10",
      iconColor: "text-red-500",
      href: "/accounts/netflix",
    },
    {
      id: "crunchyroll",
      name: "Crunchyroll",
      icon: PlaySquare,
      description: "Enjoy premium anime streaming with ad-free experience",
      color: "bg-orange-500/10",
      iconColor: "text-orange-500",
      href: "/accounts/crunchyroll",
    },
    {
      id: "steam",
      name: "Steam",
      icon: GamepadIcon,
      description: "Get access to premium Steam accounts with popular games",
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
      href: "/accounts/steam",
    },
    {
      id: "amazon",
      name: "Amazon Prime",
      icon: ShoppingBag,
      description: "Enjoy video streaming, free shipping and more",
      color: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      href: "/accounts/amazon",
    },
    {
      id: "cookies",
      name: "Netflix Cookies",
      icon: Cookie,
      description: "Direct access via browser cookies without login credentials",
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
      href: "/cookies",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Pre-verified Accounts",
      description: "All accounts are verified before they're made available to ensure they work.",
    },
    {
      icon: Copy,
      title: "One-Click Copy",
      description: "Simply click to copy the credentials and log in instantly.",
    },
    {
      icon: RefreshCw,
      title: "Auto-Refreshing",
      description: "Our system automatically adds new accounts and removes expired ones.",
    },
    {
      icon: Clock,
      title: "Real-Time Status",
      description: "See the exact status of each account before claiming it.",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-transparent py-20">
        <div className="container px-4 sm:px-6 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium mb-6">
            Premium Account Access
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-fade-in">
            Premium Accounts Available
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              {" "}
              Instantly
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance animate-fade-in opacity-90">
            Access premium streaming services, gaming platforms, and more without
            subscriptions. All accounts verified and ready to use.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button onClick={() => navigate("/accounts/netflix")} size="lg" className="h-12 px-8">
              Browse Accounts
            </Button>
            <Button
              onClick={() => navigate("/cookies")}
              variant="outline"
              size="lg"
              className="h-12 px-8"
            >
              Netflix Cookies
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Available Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Browse our collection of premium accounts for various services.
              All updated regularly and verified for quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCards.map((service, index) => (
              <div 
                key={service.id}
                className="service-card group flex flex-col hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-4 rounded-2xl ${service.color} w-14 h-14 flex items-center justify-center mb-6`}>
                  <service.icon className={`h-7 w-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-xl font-medium mb-2">{service.name}</h3>
                <p className="text-muted-foreground flex-1 mb-6">
                  {service.description}
                </p>
                <Button 
                  onClick={() => navigate(service.href)} 
                  variant="outline" 
                  className="w-full group-hover:bg-secondary transition-colors"
                >
                  Browse {service.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Our platform offers a seamless experience for accessing premium accounts with several unique advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-subtle animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Service Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-secondary/20">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Don't See What You Need?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Request a new service and we'll try to add it to our collection.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Request a New Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Request a New Service</DialogTitle>
                  <DialogDescription>
                    Let us know which service you'd like us to add to our collection.
                  </DialogDescription>
                </DialogHeader>
                <ServiceRequestForm onSuccess={() => setRequestDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to access premium content?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse our collection of verified accounts and start enjoying premium services right away.
            </p>
            <Button onClick={() => navigate("/accounts/netflix")} size="lg" className="h-12 px-8">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
