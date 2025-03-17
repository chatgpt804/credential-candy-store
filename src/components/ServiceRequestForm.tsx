
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { submitServiceRequest } from "@/lib/store";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  service: z.string().min(3, "Service name must be at least 3 characters"),
  plan: z.string().min(1, "Please select a plan"),
  reason: z.string().min(10, "Please provide more details about your request"),
});

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

const ServiceRequestForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState("netflix");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      service: "netflix",
      plan: "",
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Submit service request to Firebase
      await submitServiceRequest({
        email: values.email,
        service: values.service,
        plan: values.plan,
        reason: values.reason,
      });
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit service request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update selected service when the service field changes
  const watchService = form.watch("service");
  if (watchService !== selectedService) {
    setSelectedService(watchService);
    // Reset the plan when service changes
    form.setValue("plan", "");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="netflix">Netflix</option>
                  <option value="crunchyroll">Crunchyroll</option>
                  <option value="amazon">Amazon Prime</option>
                  <option value="steam">Steam</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Plan</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {servicePlans[selectedService as keyof typeof servicePlans].map((plan) => (
                    <FormItem 
                      key={plan.id} 
                      className="flex items-center space-x-3 space-y-0 bg-secondary/30 p-3 rounded-md"
                    >
                      <FormControl>
                        <RadioGroupItem value={plan.id} />
                      </FormControl>
                      <FormLabel className="font-normal m-0 cursor-pointer">
                        {plan.name}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why you need this service</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide details about why you need this service and how you'll use it" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Request Service"}
        </Button>
      </form>
    </Form>
  );
};

export default ServiceRequestForm;
