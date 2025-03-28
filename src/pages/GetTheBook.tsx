
import { useState } from "react";
import { Book, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const GetTheBook = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this data to a backend
    console.log({ name, email, notifications });
    
    // Show success message
    setSubmitted(true);
    toast({
      title: "Pre-order registered!",
      description: "Thank you for your interest in our book. We'll notify you when it's available.",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="tag">Coming Soon</div>
              <h1 className="heading-xl">The Simple Listening Framework</h1>
              <p className="body-lg">
                Transform your approach to communication and leadership with the definitive guide to the Simple Listening Framework by Erik Normark.
              </p>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Book size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Expected Release</p>
                  <p className="text-lg font-bold">Fall 2024</p>
                </div>
              </div>
              
              <div className="pt-6">
                <a href="#pre-order" className="btn-primary">
                  Pre-order Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="glass-card p-8 animate-fade-in-right">
              <div className="aspect-ratio-4/3 bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <div className="text-center p-8">
                    <Book size={64} className="mx-auto mb-4 text-primary/60" />
                    <h3 className="text-xl font-bold mb-2">Book Cover Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Final design in progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Details Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg mb-8 text-center">What You'll Learn</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">The Art of Deep Listening</h3>
                  <p className="text-foreground/70">
                    Discover how to transcend surface-level communication and develop true understanding through intentional listening practices.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Transforming Business Communication</h3>
                  <p className="text-foreground/70">
                    Learn how organizations have revolutionized their approach to leadership, conflict resolution, and innovation through the Simple Listening Framework.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Practical Implementation Guide</h3>
                  <p className="text-foreground/70">
                    Step-by-step instructions for integrating the framework into your daily life, with exercises and reflection prompts to deepen your practice.
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
                    Explore how diverse organizations and individuals have used the Simple Listening Framework to overcome challenges and achieve breakthrough results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order Section */}
      <section id="pre-order" className="py-24 bg-muted">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="tag mb-4">Pre-order</div>
            <h2 className="heading-lg mb-6">Reserve Your Copy Today</h2>
            <p className="body-md max-w-2xl mx-auto">
              Be among the first to receive "The Simple Listening Framework" when it launches. 
              Register your interest now and we'll notify you as soon as the book is available.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Pre-order Registration</CardTitle>
                <CardDescription>
                  Fill out this form to be notified when the book is available for purchase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
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
                    
                    <Button type="submit" className="w-full">
                      Register Pre-order Interest
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      We've recorded your interest in "The Simple Listening Framework" book. 
                      We'll notify you as soon as it becomes available.
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
