import { useState } from "react";
import { Calendar, Check, ExternalLink, Mail, Send, ShieldCheck } from "lucide-react";
import { z } from "zod";
import SEO from "@/components/SEO";
import { toast } from "@/hooks/use-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { BOOKING_URL, CONVERSION_LABELS } from "@/config/site";
import { trackCTAClick } from "@/utils/analytics";

const inviteSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  preferredTimes: z.string().optional(),
  message: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const inputClasses =
  "w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const emptyForm: InviteFormData = {
  fullName: "",
  email: "",
  company: "",
  preferredTimes: "",
  message: "",
};

const BookCall = () => {
  const [formData, setFormData] = useState<InviteFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof InviteFormData, string>>>({});
  const {
    submit,
    isSubmitting,
    submitted: isSubmitted,
    error: submitError,
  } = useFormSubmit({
    endpoint: "/book-call-handler.php",
    formName: "discovery_call_invite",
    conversionLabel: CONVERSION_LABELS.consultation,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof InviteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = inviteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InviteFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof InviteFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (await submit(formData)) {
      toast({
        title: "Request sent!",
        description: "Erik will email you an invite shortly.",
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-16 md:py-24">
      <SEO
        title="Book a Discovery Call | CLEAR Change Framework"
        description="Schedule a free 30-minute discovery call. Book instantly via Microsoft Bookings, or request a personal invite by email — no sign-in required."
        path="/book-call"
        noindex
      />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
            <Calendar className="h-7 w-7 text-primary" />
          </div>
          <h1 className="heading-lg mb-3">Book a Discovery Call</h1>
          <p className="body-lg text-foreground/70">
            A free 30-minute conversation about your organization's challenges and
            how the CLEAR framework can help. Choose whichever way is easiest for you.
          </p>
        </div>

        {/* Option A — Continue to Microsoft Bookings */}
        <div className="glass-card p-8 md:p-10 mb-6">
          <h2 className="heading-md mb-3">Pick a time now</h2>
          <p className="text-foreground/70 mb-4">
            Continue to our scheduling page to choose a slot instantly. It's hosted
            on <strong>Microsoft Bookings</strong>, so you may be asked to sign in
            with a Microsoft or work account — that's just Microsoft confirming your
            booking, not us.
          </p>
          <div className="flex items-start gap-2 text-sm text-foreground/60 mb-6">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>
              No Microsoft account? Use the email option below and we'll send you an
              invite directly — no sign-in needed.
            </span>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
            onClick={() => trackCTAClick("book_discovery_call_continue")}
          >
            Continue to Microsoft Bookings
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm font-medium text-foreground/50 uppercase tracking-wide">
            Prefer not to sign in?
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Option B — Request an invite by email */}
        <div className="glass-card p-8 md:p-10">
          <h2 className="heading-md mb-2">Request an invite by email</h2>
          <p className="text-foreground/70 mb-6">
            Share your details and Erik will email you a calendar invite — no
            Microsoft sign-in required.
          </p>

          {isSubmitted ? (
            <div
              role="status"
              className="text-center py-6"
            >
              <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request sent!</h3>
              <p className="text-foreground/70">
                Thanks{formData.fullName ? `, ${formData.fullName.split(" ")[0]}` : ""}.
                Erik will email you an invite shortly.
              </p>
            </div>
          ) : (
            <>
              {submitError && (
                <div
                  role="alert"
                  className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg"
                >
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="book-fullName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="book-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "book-fullName-error" : undefined}
                  />
                  {errors.fullName && (
                    <p id="book-fullName-error" role="alert" className="mt-1 text-sm text-destructive">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="book-email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="book-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="your.email@company.com"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "book-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="book-email-error" role="alert" className="mt-1 text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="book-company"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Company{" "}
                    <span className="text-foreground/50 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="book-company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your organization"
                  />
                </div>

                {/* Preferred times */}
                <div>
                  <label
                    htmlFor="book-preferredTimes"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Preferred times{" "}
                    <span className="text-foreground/50 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="book-preferredTimes"
                    name="preferredTimes"
                    value={formData.preferredTimes}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="e.g. weekday mornings, or next Tuesday afternoon"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="book-message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Anything you'd like us to know?{" "}
                    <span className="text-foreground/50 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="book-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell us briefly what you'd like to discuss..."
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full justify-center relative overflow-hidden"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}

                    <span className={`inline-flex items-center justify-center whitespace-nowrap ${isSubmitting ? "opacity-0" : ""}`}>
                      Request an invite
                      <Send className="ml-2 h-4 w-4 flex-shrink-0" />
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="flex items-center gap-2 text-sm text-foreground/60 mt-6">
            <Mail className="h-4 w-4" />
            <span>Or email directly:</span>
            <a
              href="mailto:erik@eb-consulting.se"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              erik@eb-consulting.se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCall;
