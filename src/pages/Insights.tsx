
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const articles = [
  {
    slug: "why-change-initiatives-fail",
    title: "Why 70% of Change Initiatives Fail (And What the Research Actually Says)",
    summary: "The statistic everyone quotes — but few understand. What does the research actually tell us about why organizational change fails, and what separates the 30% that succeed?",
    category: "Change Management",
    readTime: "8 min read",
  },
  {
    slug: "adkar-vs-clear",
    title: "ADKAR vs CLEAR: Which Change Framework Is Right for Your Organization?",
    summary: "A direct comparison of two change management approaches — one from project management, one from behavioral psychology. When to use each, and what they get right and wrong.",
    category: "Change Management",
    readTime: "10 min read",
  },
  {
    slug: "psychology-of-resistance",
    title: "The Psychology of Resistance to Change: What Leaders Get Wrong",
    summary: "Resistance isn't irrational. It's a perfectly logical response to perceived threat. Here's what a licensed psychologist sees when leaders call their teams 'resistant to change.'",
    category: "Behavioral Science",
    readTime: "7 min read",
  },
  {
    slug: "psychometric-assessments-leadership",
    title: "How Psychometric Assessments Actually Improve Leadership (A Psychologist's View)",
    summary: "Most assessment programs collect data and never use it. Here's how to connect psychometric insights to actual behavior change — and what to avoid.",
    category: "Leadership",
    readTime: "9 min read",
  },
  {
    slug: "what-is-behavioral-design",
    title: "What Is Behavioral Design? A Practical Guide for HR and OD Professionals",
    summary: "Behavioral design applies psychology to organizational systems. This guide explains what it is, how it works, and why it produces better outcomes than traditional change management.",
    category: "Behavioral Science",
    readTime: "8 min read",
  },
  {
    slug: "why-leaders-are-poor-listeners",
    title: "Why Most Leaders Are Poor Listeners (And Don't Know It)",
    summary: "Listening is the most overrated and underperformed leadership skill. Here's what genuine organizational listening looks like — and why it's the missing ingredient in most change programs.",
    category: "Leadership",
    readTime: "6 min read",
  },
];

const Insights = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Insights | Organizational Change, Leadership & Behavioral Science | Erik Bohjort"
        description="Articles on organizational change, leadership development, behavioral science, and psychometric assessments from licensed psychologist Erik Bohjort."
        path="/insights"
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="tag mb-4">Insights</div>
          <h1 className="heading-xl mb-6">
            Thinking on Change, Leadership, and Behavioral Science
          </h1>
          <p className="body-lg max-w-3xl">
            Evidence-based perspectives on organizational change, leadership development,
            and applied behavioral psychology — from a licensed psychologist who works
            in the field.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="glass-card p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-2 leading-snug">
                  {article.title}
                </h2>
                <p className="text-foreground/70 text-sm mb-4 flex-grow">
                  {article.summary}
                </p>
                <span className="text-sm text-foreground/40 italic">
                  Coming soon
                </span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="glass-card p-8 md:p-10 max-w-2xl mx-auto">
              <h2 className="heading-md mb-3">Want to Be Notified When Articles Publish?</h2>
              <p className="body-md text-foreground/70 mb-6">
                Register for the CLEAR Change Framework book to stay updated on new
                insights and resources.
              </p>
              <Link to="/get-the-book" className="btn-primary inline-flex items-center gap-2">
                Join the Mailing List
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
