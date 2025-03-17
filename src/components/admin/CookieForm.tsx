
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Cookie, addCookie } from "@/lib/store";
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
  name: z.string().min(1, "Cookie name is required"),
  value: z.string().min(1, "Cookie value is required"),
  domain: z.string().min(1, "Domain is required"),
  status: z.enum(["active", "expiring", "expired"]),
  expiresOn: z.string().optional(),
});

interface CookieFormProps {
  cookie?: Cookie;
  onSubmitSuccess: () => void;
}

const CookieForm = ({ cookie, onSubmitSuccess }: CookieFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cookie?.name || "",
      value: cookie?.value || "",
      domain: cookie?.domain || ".netflix.com",
      status: cookie?.status || "active",
      expiresOn: cookie?.expiresOn 
        ? new Date(cookie.expiresOn).toISOString().split("T")[0] 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await addCookie({
        name: values.name,
        value: values.value,
        domain: values.domain,
        status: values.status,
        expiresOn: values.expiresOn ? new Date(values.expiresOn).toISOString() : null,
      });
      onSubmitSuccess();
      toast.success("Cookie added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save cookie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cookie Name</FormLabel>
              <FormControl>
                <Input placeholder="NetflixId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cookie Value</FormLabel>
              <FormControl>
                <Input placeholder="cl2x42fs9mze04k3ntexmpl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder=".netflix.com" {...field} />
              </FormControl>
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
          {isLoading ? "Saving..." : "Add Cookie"}
        </Button>
      </form>
    </Form>
  );
};

export default CookieForm;
