
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

enum AuthMode {
  SIGN_IN = "signin",
  SIGN_UP = "signup",
  RESET_PASSWORD = "reset",
  VERIFICATION = "verification"
}

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailConfirmationError, setEmailConfirmationError] = useState(false);
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailConfirmationError(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setEmailConfirmationError(true);
          throw new Error("Please check your email and confirm your account before signing in.");
        }
        throw error;
      }
      toast.success("Successfully signed in!");
      navigate(from);
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Registration successful! Check your email for confirmation.");
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      toast.success("Confirmation email resent. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Error resending confirmation");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) throw error;
      setResetEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Error sending password reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      setVerificationEmailSent(true);
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Error sending verification email");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (mode) {
      case AuthMode.RESET_PASSWORD:
        return (
          <div className="space-y-4">
            {resetEmailSent ? (
              <Alert className="mb-4 bg-green-50">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <AlertDescription>
                  Password reset email sent! Check your inbox and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground"
                    onClick={() => setMode(AuthMode.SIGN_IN)}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}
          </div>
        );
        
      case AuthMode.VERIFICATION:
        return (
          <div className="space-y-4">
            {verificationEmailSent ? (
              <Alert className="mb-4 bg-green-50">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <AlertDescription>
                  Verification email sent! Check your inbox and follow the instructions to verify your account.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSendVerificationEmail} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Email"}
                </Button>
                
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground"
                    onClick={() => setMode(AuthMode.SIGN_IN)}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}
          </div>
        );
        
      default:
        return (
          <Tabs defaultValue={mode} className="w-full" onValueChange={(value) => setMode(value as AuthMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={AuthMode.SIGN_IN}>Sign In</TabsTrigger>
              <TabsTrigger value={AuthMode.SIGN_UP}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value={AuthMode.SIGN_IN}>
              {emailConfirmationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Your email is not confirmed yet. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-1" 
                      onClick={resendConfirmation}
                      disabled={loading}
                    >
                      Resend confirmation email
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="flex justify-between text-sm mt-2">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => setMode(AuthMode.RESET_PASSWORD)}
                  >
                    Forgot password?
                  </Button>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => setMode(AuthMode.VERIFICATION)}
                  >
                    Resend verification email
                  </Button>
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  By signing in, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value={AuthMode.SIGN_UP}>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span>Get access to premium streaming accounts</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span>Regular updates with new accounts</span>
                  </p>
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Credential Store</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access premium accounts
          </p>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default AuthPage;
