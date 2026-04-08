
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { trackFormSubmission, setEnhancedConversionData, trackGoogleAdsConversion } from "@/utils/analytics";

interface FreeChapterFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const FreeChapterForm = ({ onSuccess, compact = false }: FreeChapterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/book-chapter-handler.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      trackFormSubmission("free_chapter");
      setEnhancedConversionData(email);
      trackGoogleAdsConversion("AW-XXXXXXXXX/FREE_CHAPTER");
      toast({
        title: "Chapter on its way!",
        description: "Check your inbox for a free chapter of The CLEAR Change Framework.",
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          A free chapter of "The CLEAR Change Framework" is on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="chapter-name">Name</Label>
        <Input
          id="chapter-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chapter-email">Email</Label>
        <Input
          id="chapter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          "Get Your Free Chapter"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy and will never share your information.
      </p>
    </form>
  );
};

export default FreeChapterForm;
