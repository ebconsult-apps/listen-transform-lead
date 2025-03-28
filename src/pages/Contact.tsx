
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Prepare email data
    const emailData = {
      name: name,
      email: email,
      subject: subject,
      message: message
    };
    
    try {
      // Send data to PHP script
      const response = await fetch('/mail-handler.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message.');
      }
      
      setIsSubmitted(true);
      
      toast({
        title: "Message sent!",
        description: `Your message has been sent to hello@simplelistening.com. We'll get back to you soon.`,
      });
      
      // Reset form after animation completes
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setIsSubmitted(false);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Animate elements on page load
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.style.opacity = '1';
        heroRef.current?.classList.add('animate-fade-in-up');
      }
    }, 100);
    setTimeout(() => {
      if (formRef.current && infoRef.current) {
        formRef.current.style.opacity = '1';
        infoRef.current.style.opacity = '1';
        formRef.current?.classList.add('animate-fade-in-up');
        infoRef.current?.classList.add('animate-fade-in-up');
      }
    }, 300);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">Contact</div>
            <h1 className="heading-xl mb-6">Get In Touch</h1>
            <p className="body-lg max-w-3xl">
              Ready to transform your challenges into opportunities? Let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div ref={formRef} className="opacity-0">
              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Send a Message</h2>
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none"
                      placeholder="Your message here..."
                      required
                    />
                  </div>
                  
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
                      
                      <span className={isSubmitting || isSubmitted ? 'opacity-0' : ''}>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="opacity-0">
              <div className="glass-card p-8 md:p-10 mb-8">
                <h2 className="heading-md mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Location</h3>
                    <p className="text-foreground/70">Stockholm, Sweden</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Email</h3>
                    <a href="mailto:hello@simplelistening.com" className="text-primary hover:text-primary/80 transition-colors">
                      hello@simplelistening.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Book a Consultation</h2>
                <p className="text-foreground/70 mb-6">
                  Schedule a personal consultation to discuss how we can approach your specific challenges.
                </p>
                <a 
                  href="#" 
                  className="btn-primary w-full justify-center inline-flex"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Scheduling system coming soon!",
                      description: "Please use the contact form for now.",
                    });
                  }}
                >
                  Schedule a Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
