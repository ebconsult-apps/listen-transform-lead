
import { useState } from "react";
import { FileText, Download, Check, CheckSquare, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackFormSubmission, setEnhancedConversionData, trackGoogleAdsConversion } from "@/utils/analytics";

interface WhitepaperGateProps {
  title: string;
  description: string;
  highlights: string[];
  pdfUrl: string;
  coverImage?: string;
  whitepaperIdentifier: string;
}

const WhitepaperGate = ({
  title,
  description,
  highlights,
  pdfUrl,
  coverImage,
  whitepaperIdentifier,
}: WhitepaperGateProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/whitepaper-handler.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          newsletter_opt_in: newsletter,
          whitepaper_id: whitepaperIdentifier,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process your request.");
      }

      setIsUnlocked(true);
      trackFormSubmission("whitepaper_download");
      setEnhancedConversionData(email);
      trackGoogleAdsConversion("AW-XXXXXXXXX/WHITEPAPER");

      toast({
        title: "Success!",
        description: "Your whitepaper is ready to download.",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left side: Info */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-20 h-28 object-cover rounded-lg shadow-md flex-shrink-0"
              />
            ) : (
              <div className="p-4 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <FileText className="h-8 w-8" />
              </div>
            )}
            <div>
              <h2 className="heading-md mb-2">{title}</h2>
              <p className="body-md">{description}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Key Takeaways</h3>
            <ul className="space-y-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-foreground/50">
            <p>PDF format &middot; Free download</p>
          </div>
        </div>

        {/* Right side: Form or Download */}
        <div>
          {isUnlocked ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-6">
                <Check className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Your whitepaper is ready!</h3>
              <p className="text-foreground/70 mb-6">
                Click below to download your copy.
              </p>
              <a
                href={pdfUrl}
                download
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Get your free copy
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="wp-name"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="wp-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="wp-email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="wp-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="wp-company"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Company <span className="text-foreground/40">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="wp-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    placeholder="Your organization"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setNewsletter(!newsletter)}
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {newsletter ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    Subscribe to newsletter for frameworks and insights
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  <span className={isSubmitting ? "opacity-0" : ""}>
                    <Download className="mr-2 h-4 w-4 inline" />
                    Download Free Whitepaper
                  </span>
                </button>

                <p className="text-xs text-foreground/40 leading-relaxed">
                  We respect your privacy. Your information will only be used to
                  send you the requested resource and relevant updates.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhitepaperGate;
