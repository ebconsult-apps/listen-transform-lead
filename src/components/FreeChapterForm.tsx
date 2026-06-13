
import { useState } from "react";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { CONVERSION_LABELS } from "@/config/site";

// The chapter file delivered on success. Swap in a dedicated chapter PDF here
// when one is available; for now this is the CLEAR framework resource.
const CHAPTER_PDF_URL = "/whitepapers/clear-change-framework.pdf";

interface FreeChapterFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const FreeChapterForm = ({ onSuccess, compact = false }: FreeChapterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { submit, isSubmitting, submitted, error } = useFormSubmit({
    endpoint: "/book-chapter-handler.php",
    formName: "free_chapter",
    conversionLabel: CONVERSION_LABELS.freeChapter,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await submit({ name, email })) {
      toast({
        title: "Your chapter is ready!",
        description: "Download it below — we've also emailed you a copy.",
      });
      onSuccess?.();
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-5">
          Your free chapter of "The CLEAR Change Framework" is ready. We've also
          emailed you a copy.
        </p>
        <a
          href={CHAPTER_PDF_URL}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Your Chapter
        </a>
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
