
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Account, addAccount, updateAccount } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  service: z.string().min(1, "Service is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "expiring", "expired"]),
  expiresOn: z.string().optional(),
  plan: z.string().optional(),
});

interface AccountFormProps {
  account?: Account;
  onSubmitSuccess: () => void;
}

const AccountForm = ({ account, onSubmitSuccess }: AccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(account?.service || "netflix");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: account?.service || "netflix",
      email: account?.email || "",
      password: account?.password || "",
      status: account?.status || "active",
      expiresOn: account?.expiresOn 
        ? new Date(account.expiresOn).toISOString().split("T")[0] 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      plan: account?.plan || "",
    },
  });

  // Service plan options
  const servicePlans = {
    netflix: [
      { id: "basic", name: "Basic Plan" },
      { id: "standard", name: "Standard Plan" },
      { id: "premium", name: "Premium Plan" }
    ],
    crunchyroll: [
      { id: "free", name: "Free Plan" },
      { id: "fan", name: "Crunchyroll Fan" },
      { id: "mega_fan", name: "Crunchyroll Mega Fan" },
      { id: "ultimate_fan", name: "Crunchyroll Ultimate Fan" }
    ],
    amazon: [
      { id: "monthly", name: "Amazon Prime Monthly" },
      { id: "annual", name: "Amazon Prime Annual" },
      { id: "video_only", name: "Prime Video Only" }
    ],
    steam: [
      { id: "standard", name: "Standard Account" }
    ]
  };

  // Watch for service changes to update plan options
  const watchService = form.watch("service");
  if (watchService !== selectedService) {
    setSelectedService(watchService);
    // Reset the plan when service changes
    form.setValue("plan", "");
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (account) {
        // Update existing account
        await updateAccount(account.id, {
          service: values.service,
          email: values.email,
          password: values.password,
          status: values.status,
          expiresOn: values.expiresOn ? new Date(values.expiresOn).toISOString() : null,
          plan: values.plan,
        });
      } else {
        // Add new account
        await addAccount({
          service: values.service,
          email: values.email,
          password: values.password,
          status: values.status,
          expiresOn: values.expiresOn ? new Date(values.expiresOn).toISOString() : null,
          plan: values.plan,
        });
      }
      onSubmitSuccess();
      toast.success(account ? "Account updated successfully" : "Account added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="crunchyroll">Crunchyroll</SelectItem>
                  <SelectItem value="steam">Steam</SelectItem>
                  <SelectItem value="amazon">Amazon Prime</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {servicePlans[selectedService as keyof typeof servicePlans].map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : account ? "Update Account" : "Add Account"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
