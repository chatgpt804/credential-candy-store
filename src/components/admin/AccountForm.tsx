
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
import { Textarea } from "@/components/ui/textarea";

// Define a schema for new services
const serviceDetailsSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
});

const formSchema = z.object({
  service: z.string().min(1, "Service is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "expiring", "expired"]),
  expiresOn: z.string().optional(),
  plan: z.string().optional(),
  newService: z.boolean().optional(),
  serviceDetails: serviceDetailsSchema.optional(),
});

interface AccountFormProps {
  account?: Account;
  onSubmitSuccess: () => void;
  services?: string[];
}

const AccountForm = ({ account, onSubmitSuccess, services = ["netflix", "crunchyroll", "steam", "amazon"] }: AccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(account?.service || "netflix");
  const [isNewService, setIsNewService] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");

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
      newService: false,
      serviceDetails: {
        name: "",
        description: "",
        features: [],
        color: "text-blue-500",
        icon: "PlaySquare"
      }
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

  const handleFeatureAdd = () => {
    if (featuresInput.trim()) {
      const currentFeatures = form.getValues("serviceDetails.features") || [];
      form.setValue("serviceDetails.features", [...currentFeatures, featuresInput.trim()]);
      setFeaturesInput("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("serviceDetails.features") || [];
    form.setValue("serviceDetails.features", currentFeatures.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Handle new service creation here in a real application
      // For this example, we'll just show a toast

      if (values.newService && values.serviceDetails) {
        toast.info(`New service "${values.serviceDetails.name}" would be created in a real app`);
        // In a real app, you would store the service details in your database
      }
      
      if (account) {
        // Update existing account
        await updateAccount(account.id, {
          service: isNewService ? values.serviceDetails?.name.toLowerCase() || values.service : values.service,
          email: values.email,
          password: values.password,
          status: values.status,
          expiresOn: values.expiresOn ? new Date(values.expiresOn).toISOString() : null,
          plan: values.plan,
        });
      } else {
        // Add new account
        await addAccount({
          service: isNewService ? values.serviceDetails?.name.toLowerCase() || values.service : values.service,
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
        <div className="space-y-2">
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="newService"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newService"
                    checked={isNewService}
                    onChange={(e) => {
                      setIsNewService(e.target.checked);
                      field.onChange(e.target.checked);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="newService" className="text-sm font-medium">
                    Add New Service
                  </label>
                </FormItem>
              )}
            />
          </div>
        </div>

        {isNewService ? (
          <div className="space-y-4 border rounded-md p-4 bg-secondary/20">
            <h3 className="font-medium">New Service Details</h3>
            
            <FormField
              control={form.control}
              name="serviceDetails.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Disney+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceDetails.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the service..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Features</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Add a feature"
                />
                <Button 
                  type="button" 
                  onClick={handleFeatureAdd}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              
              <div className="mt-2">
                {form.getValues("serviceDetails.features")?.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/30 rounded px-3 py-2 mt-1">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              
              {form.formState.errors.serviceDetails?.features && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.serviceDetails.features.message}
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="serviceDetails.color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Color</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text-red-500">Red</SelectItem>
                      <SelectItem value="text-blue-500">Blue</SelectItem>
                      <SelectItem value="text-green-500">Green</SelectItem>
                      <SelectItem value="text-purple-500">Purple</SelectItem>
                      <SelectItem value="text-orange-500">Orange</SelectItem>
                      <SelectItem value="text-cyan-500">Cyan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceDetails.icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PlaySquare">Play Square</SelectItem>
                      <SelectItem value="Gamepad">Gamepad</SelectItem>
                      <SelectItem value="ShoppingBag">Shopping Bag</SelectItem>
                      <SelectItem value="Film">Film</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
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
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>{service.charAt(0).toUpperCase() + service.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                  {servicePlans[selectedService as keyof typeof servicePlans]?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  )) || <SelectItem value="standard">Standard Plan</SelectItem>}
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
