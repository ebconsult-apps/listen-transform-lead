import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import SEO from "@/components/SEO";
import WhitepaperGate from "@/components/WhitepaperGate";
import NotFound from "@/pages/NotFound";
import { getWhitepaper, whitepaperPath, whitepapers } from "@/content/whitepapers";

const SITE = "https://clear-framework.com";

/**
 * Public overview of one whitepaper at /resources/:id.
 *
 * The PDF stays behind the lead gate, but the argument, key facts and FAQ are
 * rendered as plain HTML so search and AI crawlers (which don't run JS or fill
 * forms) can read and cite the paper. Every route is listed explicitly in
 * vite.config.ts for prerendering and in public/sitemap.xml; the test in
 * src/content/whitepapers.test.ts keeps those lists in sync with the data.
 */
const WhitepaperPage = () => {
  const { id } = useParams<{ id: string }>();
  const paper = getWhitepaper(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!paper) return <NotFound />;

  const url = `${SITE}${whitepaperPath(paper.id)}`;
  const related = whitepapers.filter((w) => w.id !== paper.id).slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Report",
        "@id": `${url}#report`,
        name: paper.title,
        headline: paper.title,
        alternativeHeadline: paper.subtitle,
        description: paper.description,
        abstract: paper.summary[0],
        url,
        inLanguage: "en",
        isAccessibleForFree: true,
        genre: paper.category,
        keywords: paper.keywords.join(", "),
        ...(paper.datePublished ? { datePublished: paper.datePublished } : {}),
        ...(paper.pages ? { numberOfPages: paper.pages } : {}),
        author: {
          "@type": "Person",
          "@id": `${SITE}/about#person`,
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist & Behaviour Change Consultant",
          url: `${SITE}/about`,
        },
        publisher: {
          "@type": "ProfessionalService",
          "@id": `${SITE}/#organization`,
          name: "EB Consulting",
          url: SITE,
        },
        about: [
          { "@type": "Thing", name: "Behaviour change" },
          { "@type": "Thing", name: "Behavioural science" },
          { "@type": "Thing", name: "Organisational change" },
        ],
        isPartOf: {
          "@type": "CreativeWorkSeries",
          name: "CLEAR Change Framework whitepapers",
          url: `${SITE}/resources`,
        },
        encoding: {
          "@type": "MediaObject",
          encodingFormat: "application/pdf",
          contentUrl: `${SITE}${paper.pdfUrl}`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: paper.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Resources", item: `${SITE}/resources` },
          { "@type": "ListItem", position: 2, name: paper.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="min-h-screen">
      <SEO
        title={`${paper.title} | Whitepaper by Erik Bohjort`}
        description={paper.description}
        path={whitepaperPath(paper.id)}
        type="article"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="pt-12 pb-12 sm:pt-16 sm:pb-16">
        <div className="section-container">
          <Link
            to="/resources"
            className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            All whitepapers
          </Link>
          <div className="max-w-4xl">
            <div className="tag mb-4">Whitepaper &middot; {paper.category}</div>
            <h1 className="heading-xl mb-6">{paper.title}</h1>
            {paper.subtitle && <p className="body-lg max-w-3xl mb-6">{paper.subtitle}</p>}
            <p className="text-sm text-foreground/60">
              By Erik Bohjort, licensed psychologist and creator of the CLEAR Change Framework,
              Stockholm, Sweden
              {paper.datePublished && <> &middot; {formatDate(paper.datePublished)}</>}
              {paper.pages && <> &middot; {paper.pages} pages, PDF</>}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="pb-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card p-8 md:p-10 border-t-4 border-t-primary">
                <h2 className="heading-md mb-6">In brief</h2>
                <div className="space-y-4">
                  {paper.summary.map((para) => (
                    <p key={para.slice(0, 40)} className="body-md">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 md:p-10">
                <h2 className="heading-md mb-6">Key points</h2>
                <ul className="space-y-4">
                  {paper.keyPoints.map((point) => (
                    <li key={point.slice(0, 40)} className="flex items-start gap-3 body-md">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-3 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plain <dl>, not an accordion: crawlers read it without JS */}
              <div>
                <h2 className="heading-md mb-6">Questions this paper answers</h2>
                <dl className="space-y-6">
                  {paper.faqs.map((faq) => (
                    <div key={faq.question} className="glass-card p-6 md:p-8">
                      <dt className="text-lg font-bold mb-2">{faq.question}</dt>
                      <dd className="text-foreground/70 leading-relaxed">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Sidebar: in-page download gate */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold">Get the full paper</h2>
                  </div>
                  <p className="text-sm text-foreground/70">
                    The complete PDF with the full argument, tables and references is free.
                    Fill in the short form below.
                  </p>
                </div>
                <div id="download">
                  <WhitepaperGate
                    title={paper.title}
                    description={paper.description}
                    highlights={paper.takeaways}
                    pdfUrl={paper.pdfUrl}
                    whitepaperIdentifier={paper.id}
                    placement="page"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="pb-16">
        <div className="section-container">
          <h2 className="heading-md mb-8">More whitepapers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((w) => (
              <Link
                key={w.id}
                to={whitepaperPath(w.id)}
                className="glass-card p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="text-xs uppercase tracking-wider text-foreground/50 mb-2">
                  {w.category}
                </div>
                <h3 className="text-lg font-bold mb-2">{w.title}</h3>
                <p className="text-sm text-foreground/70 flex-1">{w.description}</p>
                <span className="mt-4 inline-flex items-center text-primary font-medium text-sm">
                  Read the overview
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="section-container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center bg-primary/5">
            <h2 className="heading-md mb-4">Apply this to a behaviour you need to change</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              Erik Bohjort works with organisations in Sweden, the Nordics and Europe to turn
              arguments like this one into measurable behaviour change.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/book-call" className="btn-primary">
                Book a Free Discovery Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/consulting/behaviour-change-consultant-sweden" className="btn-secondary">
                Behaviour change consulting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

function formatDate(iso: string): string {
  const [year, month] = iso.split("-");
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default WhitepaperPage;
