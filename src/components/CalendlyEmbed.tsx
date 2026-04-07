// Microsoft Bookings - Discovery Call
// For inline embed alternative: <iframe src="https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink" width="100%" height="700" scrolling="yes" style="border:0"></iframe>

import { Calendar, Mail, ExternalLink } from "lucide-react";

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
        href="https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full justify-center mb-6"
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
