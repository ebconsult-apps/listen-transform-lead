// Microsoft Bookings - Discovery Call
// For inline embed alternative: <iframe src={BOOKING_URL} width="100%" height="700" scrolling="yes" style="border:0"></iframe>

import { Calendar, Mail, ExternalLink } from "lucide-react";
import { trackCTAClick } from "@/utils/analytics";
import { BOOKING_URL } from "@/config/site";

const CalendlyEmbed = () => {
  return (
    <div className="glass-card p-8 md:p-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <h2 className="heading-md">Book a Discovery Call</h2>
      </div>

      <p className="text-foreground/70 mb-8">
        Schedule a free 30-minute discovery call to discuss your organization's
        challenges and explore how the CLEAR framework can help.
      </p>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full justify-center mb-6"
        onClick={() => trackCTAClick("book_discovery_call")}
      >
        Book a Discovery Call
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>

      <div className="flex items-center gap-2 text-sm text-foreground/60">
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
  );
};

export default CalendlyEmbed;
