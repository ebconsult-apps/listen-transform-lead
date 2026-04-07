
import { useState } from "react";
import { CheckCircle, ArrowRight, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import FreeChapterForm from "@/components/FreeChapterForm";

const GetTheBook = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const bookInterestData = {
      name,
      email,
      notifications
    };

    try {
      // Send data to PHP script
      const response = await fetch('/book-interest-handler.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookInterestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register your interest.');
      }

      // Show success message
      setSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as the book launches."
      });
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

  return (
    <div className="min-h-screen">
      <SEO
        title="The Simple Listening Framework Book | Erik Bohjort"
        description="Discover how genuine, structured listening can unlock organizational transformation. The Simple Listening Framework by Erik Bohjort gives leaders a practical blueprint for turning listening into strategic action."
        path="/get-the-book"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Book",
          "name": "The Simple Listening Framework",
          "author": { "@type": "Person", "name": "Erik Bohjort" },
          "bookFormat": "EBook",
          "bookEdition": "First Edition",
          "url": "https://clear-framework.com/get-the-book"
        }}
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="tag">Coming Soon</div>
              <h1 className="heading-xl">The Simple Listening Framework</h1>
              <p className="body-lg">
                Most change initiatives fail not because of bad strategy, but because leaders stop listening too soon.
                This book gives you a proven, psychology-backed framework for turning genuine listening into the catalyst
                for lasting organizational transformation.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <a href="#free-chapter" className="btn-primary">
                  Get a Free Chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a href="#register-interest" className="btn-secondary">
                  Pre-Register for Updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="tag mb-4">Inside the Book</div>
              <h2 className="heading-lg mb-4">What You'll Learn</h2>
              <p className="body-md max-w-2xl mx-auto">
                A practical guide grounded in psychology, systems thinking, and decades of real-world consulting experience.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Why Most Change Initiatives Fail</h3>
                  <p className="text-foreground/70">
                    Explore the psychology behind resistance to change and why traditional top-down approaches
                    consistently fall short of delivering lasting results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">The SIMPLE Listening Framework</h3>
                  <p className="text-foreground/70">
                    A 7-step process for deep organizational listening that surfaces hidden insights, builds trust,
                    and creates the conditions for meaningful transformation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">The CLEAR Change Framework in Action</h3>
                  <p className="text-foreground/70">
                    Learn how to apply the CLEAR Change Framework to move from insight to action — turning what you
                    hear into Clarity, Leverage, Experimentation, Analysis, and Refinement.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Real-World Case Studies</h3>
                  <p className="text-foreground/70">
                    See how corporations, startups, and government agencies have used these frameworks to overcome
                    entrenched challenges and achieve breakthrough results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Building a Culture of Listening</h3>
                  <p className="text-foreground/70">
                    Discover how to embed listening into your organization's DNA so that transformation
                    isn't a one-time event but a sustained, self-reinforcing capability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Chapter Section */}
      <section id="free-chapter" className="py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="tag mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Free Preview
            </div>
            <h2 className="heading-lg mb-6">Get a Free Chapter</h2>
            <p className="body-md max-w-2xl mx-auto">
              Not sure if this book is for you? Read the opening chapter and discover why listening
              is the most underused leadership tool in organizational change.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Download a Free Chapter</CardTitle>
                <CardDescription>
                  Enter your details and we'll send a chapter straight to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FreeChapterForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About the Author Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    <img
                      src="/erik-interview.jpg"
                      alt="Erik Bohjort"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="tag mb-3">
                    <User className="h-3 w-3 mr-1" />
                    About the Author
                  </div>
                  <h2 className="heading-md mb-4">Erik Bohjort</h2>
                  <p className="body-md mb-4">
                    Erik Bohjort is a licensed psychologist and organizational change consultant with
                    extensive experience advising EU Parliament policies, global corporations, state agencies,
                    and innovative startups. His work sits at the intersection of psychology, systems thinking,
                    and practical leadership.
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Learn more about Erik
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Register / Launch Updates Section */}
      <section id="register-interest" className="py-24 bg-muted">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="tag mb-4">Stay Updated</div>
            <h2 className="heading-lg mb-6">Be the First to Know</h2>
            <p className="body-md max-w-2xl mx-auto">
              Pre-register for launch updates and be among the first to get your copy
              of "The Simple Listening Framework" when it releases.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Register for Launch Updates</CardTitle>
                <CardDescription>
                  We'll let you know the moment the book is available — plus early-bird offers and bonus content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-4 mb-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="notifications"
                        checked={notifications}
                        onCheckedChange={(checked: boolean) => setNotifications(checked)}
                      />
                      <Label htmlFor="notifications" className="text-sm">
                        Send me book updates and related content from SLF
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : "Pre-Register Now"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">You're on the List!</h3>
                    <p className="text-muted-foreground">
                      We'll notify you as soon as "The Simple Listening Framework" is available,
                      along with any early-bird offers.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Your information will be handled according to our privacy policy.
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetTheBook;
