import { useState } from "react";
import { Check, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const leadSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().optional(),
  orgSize: z.string().optional(),
  challengeType: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const orgSizeOptions = ["1-50", "51-200", "201-1000", "1000+"];

const challengeTypeOptions = [
  "Culture & Collaboration",
  "Operational Efficiency",
  "Customer Experience & Retention",
  "Sustainability & ESG",
  "Leadership Development",
  "Digital Transformation",
  "Other",
];

const timelineOptions = [
  "Immediate need",
  "1-3 months",
  "3-6 months",
  "Just exploring",
];

const inputClasses =
  "w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const LeadForm = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: "",
    email: "",
    company: "",
    jobTitle: "",
    orgSize: "",
    challengeType: "",
    timeline: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate with Zod
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LeadFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/lead-handler.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit form.");
      }

      setIsSubmitted(true);

      toast({
        title: "Consultation request sent!",
        description:
          "We've received your request and will be in touch within 1-2 business days.",
      });

      // Reset form after animation
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          company: "",
          jobTitle: "",
          orgSize: "",
          challengeType: "",
          timeline: "",
          description: "",
        });
        setIsSubmitted(false);
      }, 2000);
    } catch (err) {
      setSubmitError(
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
      <h2 className="heading-md mb-2">Request a Consultation</h2>
      <p className="text-foreground/70 mb-6">
        Tell us about your organization and challenges so we can prepare for a
        productive conversation.
      </p>

      {submitError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="lead-fullName"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="lead-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="lead-email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="lead-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="your.email@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label
            htmlFor="lead-company"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Company Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="lead-company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Your organization"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-destructive">{errors.company}</p>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label
            htmlFor="lead-jobTitle"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Job Title
          </label>
          <input
            type="text"
            id="lead-jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Your role"
          />
        </div>

        {/* Organization Size & Challenge Type - side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Organization Size */}
          <div>
            <label
              htmlFor="lead-orgSize"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Organization Size
            </label>
            <select
              id="lead-orgSize"
              name="orgSize"
              value={formData.orgSize}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Select size</option>
              {orgSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} employees
                </option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label
              htmlFor="lead-timeline"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Timeline
            </label>
            <select
              id="lead-timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Select timeline</option>
              {timelineOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Challenge Type */}
        <div>
          <label
            htmlFor="lead-challengeType"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Challenge Type
          </label>
          <select
            id="lead-challengeType"
            name="challengeType"
            value={formData.challengeType}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select a challenge area</option>
            {challengeTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Brief Description */}
        <div>
          <label
            htmlFor="lead-description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Brief Description{" "}
            <span className="text-foreground/50 font-normal">(optional)</span>
          </label>
          <textarea
            id="lead-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Tell us briefly about your situation and what you're hoping to achieve..."
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="btn-primary w-full justify-center relative overflow-hidden"
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {isSubmitted && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}

            <span className={isSubmitting || isSubmitted ? "opacity-0" : ""}>
              Request a Consultation
              <Send className="ml-2 h-4 w-4" />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
