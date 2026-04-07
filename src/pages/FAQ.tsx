import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is the CLEAR Change Framework?",
    answer:
      "The CLEAR Change Framework is a five-step, iterative methodology for organizational change created by Erik Bohjort, a licensed psychologist. CLEAR stands for Clarity, Leverage, Experimentation, Analysis, and Refinement. It combines behavioral science, systems thinking, and design thinking principles to help organizations navigate complex transformations. Built on Kurt Lewin's Unfreeze-Change-Refreeze model, CLEAR emphasizes listening as the critical catalyst at every stage of the change process.",
  },
  {
    question: "How does CLEAR compare to Kotter's 8-Step Change Model?",
    answer:
      "While Kotter's model follows a linear, sequential 8-step process, the CLEAR framework is designed to be iterative and cyclical. CLEAR adds systematic systems mapping (Leverage) and rapid experimentation phases that Kotter's model lacks. Where Kotter prescribes fixed stages like \"creating a guiding coalition\" and \"generating short-term wins,\" CLEAR encourages continuous learning loops where each cycle of Clarity, Leverage, Experimentation, Analysis, and Refinement builds on the previous one. CLEAR is better suited for complex, adaptive challenges where the solution isn't known upfront.",
  },
  {
    question: "How does CLEAR compare to ADKAR?",
    answer:
      "ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement) focuses primarily on individual-level behavior change within organizations. The CLEAR framework operates at the organizational system level, using systems mapping to identify leverage points across the entire organization. While ADKAR is excellent for managing the people side of change, CLEAR addresses both the systemic and human dimensions simultaneously through its integration of behavioral science and systems thinking.",
  },
  {
    question: "What is systems mapping in organizational change?",
    answer:
      "Systems mapping is a visual process of identifying and documenting the interconnected elements, relationships, and feedback loops within an organizational system. In the CLEAR framework, this happens during the Leverage phase \u2014 cross-functional teams collaboratively map how different parts of the organization influence each other. The goal is to identify high-impact leverage points where targeted interventions can create maximum positive change with minimum effort. This is based on systems thinking principles and helps avoid the common mistake of treating symptoms rather than root causes.",
  },
  {
    question: "Who is the CLEAR framework designed for?",
    answer:
      "The CLEAR framework is designed for organizations facing complex change challenges across any industry. This includes global corporations seeking to improve cross-department collaboration, manufacturing companies aiming to reduce operational downtime, technology startups looking to boost customer retention, organizations implementing sustainability initiatives, and government agencies navigating policy changes. It is particularly effective for situations where traditional linear change models have failed or where the challenges are too complex for simple solutions.",
  },
  {
    question: "What role does listening play in the CLEAR framework?",
    answer:
      "Listening is the foundational principle that runs through every step of the CLEAR framework. In the Clarity phase, listening helps uncover the true purpose and motivation for change. During Leverage, listening to cross-functional perspectives reveals hidden system dynamics. In Experimentation, listening to system responses guides adjustments. During Analysis, deep listening to data and feedback reveals insights. And in Refinement, listening ensures learnings are properly integrated. Erik Bohjort's approach treats listening not as passive hearing, but as an active, strategic process that creates psychological safety and enables genuine transformation.",
  },
  {
    question: "How long does a typical CLEAR engagement take?",
    answer:
      "CLEAR engagements vary based on scope and complexity. A diagnostic workshop can be completed in 1-2 days, providing initial clarity and systems mapping. A full CLEAR implementation program typically runs 3-6 months, including multiple iterative cycles. Some organizations maintain ongoing advisory relationships with quarterly CLEAR cycles for continuous improvement. The iterative nature of CLEAR means that value is delivered early and builds with each cycle.",
  },
  {
    question: "What makes CLEAR different from Design Thinking?",
    answer:
      "Design Thinking is excellent for product and service innovation, focusing on empathy, ideation, and prototyping. CLEAR extends these principles to full organizational transformation. While Design Thinking typically focuses on external user needs, CLEAR addresses internal organizational systems, employee behavior, culture change, and operational efficiency. CLEAR also adds the Leverage phase (systems mapping) and a more rigorous Analysis phase grounded in behavioral science, making it suitable for complex organizational challenges beyond product development.",
  },
  {
    question: "What is the theoretical foundation of CLEAR?",
    answer:
      "The CLEAR framework is grounded in several established theoretical traditions: Kurt Lewin's Change Model (Unfreeze-Change-Refreeze), goal-setting theory from organizational psychology (Locke and Latham), systems thinking and complexity science, behavioral design and nudge theory, and action research methodology. Erik Bohjort, as a licensed psychologist, has integrated these evidence-based approaches into a practical, accessible framework that bridges the gap between academic research and real-world organizational needs.",
  },
  {
    question: "How do I get started with the CLEAR framework?",
    answer:
      "The best first step is to book a discovery call with Erik Bohjort to discuss your organization's specific challenges and goals. You can also download one of the free CLEAR framework whitepapers from the Resources page for a deeper understanding of the methodology. For organizations ready to begin, a typical starting point is a 1-2 day diagnostic workshop that provides initial clarity on objectives and a preliminary systems map.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const FAQ = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.classList.add("animate-fade-in-up");
        heroRef.current.style.opacity = "1";
      }
    }, 100);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.classList.add("animate-fade-in-up");
        contentRef.current.style.opacity = "1";
      }
    }, 300);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="FAQ - CLEAR Change Framework | Common Questions Answered"
        description="Frequently asked questions about the CLEAR Change Framework, its methodology, how it compares to Kotter and ADKAR, systems mapping, and how to get started with organizational change."
        path="/faq"
        structuredData={faqStructuredData}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} className="opacity-0">
            <div className="tag mb-4">FAQ</div>
            <h1 className="heading-xl mb-6">Frequently Asked Questions</h1>
            <p className="body-lg max-w-3xl">
              Everything you need to know about the CLEAR Change Framework,
              its methodology, and how it can help your organization navigate
              complex transformations.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="pb-20">
        <div className="section-container">
          <div
            ref={contentRef}
            className="glass-card p-8 md:p-10 max-w-3xl mx-auto opacity-0"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <h3 className="text-lg font-semibold pr-4">
                      {item.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="body-md">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center">
            <h2 className="heading-md mb-6">Still Have Questions?</h2>
            <p className="body-md mb-8">
              Book a free discovery call with Erik Bohjort to discuss your
              organization's specific challenges and how the CLEAR framework
              can help.
            </p>
            <Link to="/contact" className="btn-primary">
              Get In Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
