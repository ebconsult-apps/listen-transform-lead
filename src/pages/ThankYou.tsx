
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ThankYou = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Message Received | CLEAR Change Framework"
        description="Thank you for reaching out. Erik typically responds within one business day."
        path="/thank-you"
      />

      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>

            <h1 className="heading-xl mb-4">Message Received</h1>

            <p className="body-lg text-foreground/70 mb-4">
              Thank you for reaching out. Erik typically responds within one
              business day.
            </p>

            <p className="body-md text-foreground/60 mb-10">
              Want to skip the email exchange and book a time directly?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Book a Discovery Call
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <Link to="/assessment" className="btn-secondary">
                Take the Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <Link
              to="/"
              className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;
