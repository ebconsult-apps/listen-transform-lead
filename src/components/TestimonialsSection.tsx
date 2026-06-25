import { Quote } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    quote: "With Erik's guidance, we transformed our HR-data strategy, resulting in a breakthrough deal that exceeded our expectations.",
    author: "CEO",
    company: "International Healthcare Provider"
  },
  {
    id: 2,
    quote: "Through his thorough and empathetic approach, Erik helped our team find a new path forward with our product strategy.",
    author: "CEO",
    company: "Deep Tech Startup"
  },
  {
    id: 3,
    quote: "What sets Erik apart is his ability to combine psychological insight with practical business acumen. Through our project together we created long term solutions for complex sustainability issues, and proved its efficiency.",
    author: "CCO",
    company: "Housing Organisation"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-muted/10">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="tag mb-4">Testimonials</div>
          <h2 className="heading-lg mb-6">What Others Say</h2>
        </div>

        {/* Static quote wall — all three at once, middle card offset for an asymmetric rhythm */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {testimonials.map((t, i) => (
            <figure
              key={t.id}
              className={`glass-card p-8 flex flex-col h-full ${i === 1 ? "md:mt-10" : ""}`}
            >
              <Quote className="h-7 w-7 text-primary/30 mb-5" aria-hidden="true" />
              <blockquote className="font-display font-light italic text-foreground/90 leading-relaxed mb-6 flex-grow">
                {t.quote}
              </blockquote>
              <figcaption className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{t.author}</p>
                <p className="text-sm text-foreground/60">{t.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
