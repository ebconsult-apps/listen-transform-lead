import { useEffect, useRef } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { PROFILE, personJsonLd } from "@/content/profile";

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Animate elements on page load
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.classList.add('animate-fade-in-up');
        heroRef.current.style.opacity = '1';
      }
    }, 100);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.classList.add('animate-fade-in-up');
        contentRef.current.style.opacity = '1';
      }
    }, 300);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="About Erik Bohjort | Licensed Psychologist & Behaviour Change Consultant, Stockholm"
        description="Erik Bohjort is a licensed psychologist (Uppsala University) and behavioural design specialist based in Stockholm, Sweden: creator of the CLEAR Change Framework, member of the Swedish Energy Agency's expert board on behavioural design, and teacher of behavioural design at specialist level for psychologists."
        path="/about"
        structuredData={{
          "@context": "https://schema.org",
          ...personJsonLd("en"),
        }}
      />
      {/* Hero Section — two-column: copy left, portrait right */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="tag mb-4">About</div>
              <h1 className="heading-xl mb-6">Erik Bohjort</h1>
              <p className="body-lg max-w-2xl mb-4">
                Licensed psychologist (Uppsala University) and behavioural design specialist based in
                Stockholm, Sweden. Founder of EB Consulting and creator of the CLEAR Change Framework.
                Erik helps organisations in Sweden and internationally change what people actually do,
                in energy, pensions and finance, news media, digital design and the public sector.
              </p>
              <p className="body-md text-foreground/70 max-w-2xl">
                He sits on the Swedish Energy Agency's expert board on behavioural design, teaches
                behavioural design at specialist level for psychologists, and co-founded an award-winning
                deep-tech psychometrics startup.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full max-w-sm mx-auto lg:ml-auto rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/erik-interview.jpg"
                  alt="Portrait of Erik Bohjort"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div ref={contentRef} className="lg:col-span-8 opacity-0 space-y-8">
              {/* Selected work — concrete outcomes, clients unnamed */}
              <div className="glass-card p-8 md:p-10 border-t-4 border-t-primary">
                <h2 className="heading-md mb-6">Selected work</h2>
                <ul className="space-y-4 body-md">
                  {PROFILE.selectedWork.map((item) => (
                    <li key={item.en} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                      <span>{item.en}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-foreground/60 mt-6">
                  Clients are not named here. Sectors: {PROFILE.sectors.en.join(", ").toLowerCase()}.
                </p>
              </div>

              {/* Two-up: Approach + Team */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">Approach</h2>
                  <p className="body-md mb-4">
                    Most change programmes push strategy and hope behaviour follows. Erik starts from the
                    behaviour: one measurable thing a specific group needs to do differently, a diagnosis of
                    what drives it today, and interventions tested small before they are scaled.
                  </p>
                  <p className="body-md">
                    The CLEAR Change Framework is that method written down: Clarify, Leverage, Experiment,
                    Analyse, Refine. It combines behavioural science, psychometrics and systems thinking with
                    a clinician's habit of listening before prescribing.
                  </p>
                </div>

                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">How engagements are staffed</h2>
                  <p className="body-md mb-4">{PROFILE.team.en}</p>
                  <p className="body-md">
                    That keeps every engagement personal while allowing multi-country programmes,
                    industry-specific expertise and parallel workstreams when they are needed.
                  </p>
                </div>
              </div>

              {/* Credentials — the facts module */}
              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Credentials and roles</h2>
                <ul className="space-y-4 body-md">
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                    <span>
                      {PROFILE.education.degree}, {PROFILE.education.school}
                    </span>
                  </li>
                  {PROFILE.roles.map((role) => (
                    <li key={role.en} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                      <span>{role.en}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Speaking + media, two-up */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">Speaking</h2>
                  <ul className="space-y-3 body-md">
                    {PROFILE.speaking.map((talk) => (
                      <li key={talk.event} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                        <span>
                          {talk.url ? (
                            <a
                              href={talk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {talk.event}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            talk.event
                          )}
                          {talk.year && <> ({talk.year})</>}
                          {talk.topic && <span className="text-foreground/60">: {talk.topic}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-foreground/60 mt-4">{PROFILE.speakingNote.en}</p>
                </div>

                <div className="glass-card p-8">
                  <h2 className="heading-md mb-6">In the media and in print</h2>
                  <ul className="space-y-3 body-md">
                    {PROFILE.media.map((item) => (
                      <li key={item.en} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                        <span>{item.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar — slim sticky contact rail */}
            <div className="lg:col-span-4">
              <div className="glass-card p-8 sticky top-28">
                <h3 className="text-xl font-bold mb-1">Erik Bohjort</h3>
                <p className="text-foreground/70 text-sm mb-1">
                  Licensed Psychologist &amp; Behaviour Change Consultant
                </p>
                <p className="text-foreground/50 text-sm mb-6">Stockholm, Sweden</p>
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center mt-3"
                >
                  LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link
                  to="/sv/beteendedesign-och-forandringsledning"
                  className="block text-center text-sm text-foreground/60 hover:text-foreground mt-4"
                  lang="sv"
                >
                  Läs på svenska
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center bg-primary/5">
            <h2 className="heading-md mb-6">Ready to Transform Your Organization?</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              Whether you're navigating complex change or looking to build a more adaptive
              organization, let's explore how the CLEAR framework can help.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
