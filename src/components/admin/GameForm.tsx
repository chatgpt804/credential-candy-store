
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addGameToAccount, updateGame, Game } from "@/lib/store";
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
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Game name is required"),
  description: z.string().optional(),
});

interface GameFormProps {
  accountId: string;
  game?: Game;
  onSubmitSuccess: () => void;
}

const GameForm = ({ accountId, game, onSubmitSuccess }: GameFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: game?.name || "",
      description: game?.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (game) {
        // Update existing game
        await updateGame(game.id, {
          name: values.name,
          description: values.description,
        });
      } else {
        // Add new game
        await addGameToAccount({
          name: values.name,
          description: values.description,
          accountId: accountId,
        });
      }
      onSubmitSuccess();
      toast.success(game ? "Game updated successfully" : "Game added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save game");
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
              <FormLabel>Game Name</FormLabel>
              <FormControl>
                <Input placeholder="Cyberpunk 2077" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Open-world RPG game set in a dystopian future" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : game ? "Update Game" : "Add Game"}
        </Button>
      </form>
    </Form>
  );
};

export default GameForm;
