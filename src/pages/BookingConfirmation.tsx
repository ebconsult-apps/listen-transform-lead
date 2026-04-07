import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SEO
        title="Booking Confirmed | CLEAR Change Framework"
        description="Your discovery call has been booked. We look forward to discussing how the CLEAR Change Framework can help your organization."
        path="/booking-confirmed"
      />
      <div className="glass-card p-10 md:p-14 max-w-lg text-center animate-fade-in">
        <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="heading-lg mb-4">You're All Set!</h1>
        <p className="body-lg text-foreground/70 mb-3">
          Your discovery call has been booked. You'll receive a confirmation
          email with the meeting details shortly.
        </p>
        <p className="body-md text-foreground/60 mb-8">
          In the meantime, explore the CLEAR Change Framework to prepare for our conversation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/methodology" className="btn-primary">
            Explore the Framework
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/resources" className="btn-secondary">
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
