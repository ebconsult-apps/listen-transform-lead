import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";
import { PROFILE, personJsonLd, ORG_ID } from "@/content/profile";

/**
 * Swedish entity page for the query family "beteendedesign / beteendeförändring /
 * förändringsledning, psykolog, Stockholm". Written in the first person, as Erik.
 * Paired with the English behaviour-change page through hreflang.
 */

const PATH = "/sv/beteendedesign-och-forandringsledning";
const EN_PATH = "/consulting/behaviour-change-consultant-sweden";

const faqs = [
  {
    question: "Vad är beteendedesign?",
    answer:
      "Beteendedesign är att utforma miljöer, processer och val så att det önskade beteendet blir det enkla beteendet. I stället för att övertyga människor att göra rätt ändrar man förutsättningarna: standardval, friktion, återkoppling och sammanhang. Grunden är beteendevetenskap, framför allt COM-B-modellen (förmåga, möjlighet, motivation) och forskningen om nudging.",
  },
  {
    question: "Vad skiljer beteendedesign från traditionell förändringsledning?",
    answer:
      "Traditionell förändringsledning styr ett projekt: milstolpar, intressentplaner, utbildning och kommunikation. Beteendedesign styr själva beteendet. Motstånd, vanor och incitament behandlas som psykologiska mekanismer att designa för, och man mäter om människor faktiskt gör något annorlunda, inte om de säger att de stödjer förändringen. Jag arbetar med båda: förändringsledning och strategi med beteendet som utgångspunkt.",
  },
  {
    question: "Hur ser ett uppdrag ut?",
    answer:
      "Det börjar med ett kostnadsfritt inledande samtal. Därefter en diagnostisk workshop på en till två dagar som ger ett mätbart mål och en första systemkarta över vad som driver beteendet i dag. Ett fullt CLEAR-program löper oftast tre till sex månader i iterativa cykler: klargör, kartlägg hävstänger, experimentera, analysera, förfina. Flera uppdragsgivare fortsätter sedan med kvartalsvis rådgivning.",
  },
  {
    question: "Vilka organisationer arbetar du med?",
    answer:
      "Energibolag, pensions- och finansaktörer, mediehus, digitala produkt- och tjänsteorganisationer, myndigheter och EU-institutioner, handelsföretag och deep tech-startups. Bland uppdragsgivare i offentlig sektor finns Arbetsförmedlingen, Försäkringskassan och Energimyndigheten. Uppdragsgivarna finns i Sverige, Norden och internationellt; privata kunder namnges inte på den här sidan.",
  },
  {
    question: "Var finns du och på vilka språk arbetar du?",
    answer:
      "Jag är baserad i Stockholm och arbetar på svenska och engelska, på plats eller på distans.",
  },
];

const BeteendedesignForandringsledning = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://clear-framework.com${PATH}#service`,
        name: "Beteendedesign och förändringsledning",
        description:
          "Beteendedesign, beteendeförändring och förändringsledning för organisationer, med legitimerad psykolog Erik Bohjort i Stockholm.",
        serviceType: ["Beteendedesign", "Beteendeförändring", "Förändringsledning", "Strategirådgivning"],
        inLanguage: "sv",
        availableLanguage: ["sv", "en"],
        provider: {
          "@type": "ProfessionalService",
          "@id": ORG_ID,
          name: PROFILE.company,
          url: "https://clear-framework.com",
          email: PROFILE.email,
          address: { "@type": "PostalAddress", addressLocality: "Stockholm", addressCountry: "SE" },
          founder: { "@id": "https://clear-framework.com/about#person" },
        },
        areaServed: [
          { "@type": "Country", name: "Sverige" },
          { "@type": "City", name: "Stockholm" },
          { "@type": "Place", name: "Norden" },
        ],
        url: `https://clear-framework.com${PATH}`,
      },
      personJsonLd("sv"),
      {
        "@type": "FAQPage",
        "@id": `https://clear-framework.com${PATH}#faq`,
        inLanguage: "sv",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <article className="min-h-screen">
      <SEO
        title="Beteendedesign och förändringsledning | Erik Bohjort, leg. psykolog, Stockholm"
        description="Legitimerad psykolog (Uppsala universitet) och specialist på beteendedesign i Stockholm. Jag hjälper organisationer att ändra vad människor faktiskt gör: beteendeförändring, förändringsledning och strategi med CLEAR-metoden."
        path={PATH}
        lang="sv"
        alternates={[
          { hrefLang: "sv", path: PATH },
          { hrefLang: "en", path: EN_PATH },
          { hrefLang: "x-default", path: EN_PATH },
        ]}
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="section-container">
          <div className="max-w-4xl">
            <div className="tag mb-4">Stockholm</div>
            <h1 className="heading-xl mb-6">
              Beteendedesign och förändringsledning med en legitimerad psykolog
            </h1>
            <p className="body-lg max-w-3xl mb-4">
              Jag heter Erik Bohjort. Jag är legitimerad psykolog, utbildad vid Uppsala universitet,
              och specialist på beteendedesign. Från Stockholm hjälper jag organisationer i Sverige och
              internationellt att ändra vad människor faktiskt gör: i energisektorn, inom pension och
              finans, i mediehus, i digital design och i offentlig sektor.
            </p>
            <p className="body-md text-foreground/70 max-w-3xl">
              Jag sitter i Energimyndighetens expertråd för beteendedesign, undervisar i beteendedesign
              på specialistnivå för psykologer och är upphovsman till CLEAR Change Framework.
            </p>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="pb-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-t-4 border-t-primary">
              <h2 className="heading-md mb-4">Vad jag gör</h2>
              <p className="body-md mb-4">
                De flesta förändringsprogram driver strategi och hoppas att beteendet följer efter.
                Jag börjar i andra änden: ett mätbart beteende som en specifik grupp behöver göra
                annorlunda, en diagnos av vad som driver beteendet i dag, och insatser som testas i
                liten skala innan de rullas ut.
              </p>
              <p className="body-md">
                Det gör mig till både beteendedesigner och förändringsledare. Uppdragen handlar lika
                ofta om strategi och ledning som om nudging: att få en organisation att faktiskt
                använda ett nytt arbetssätt, följa en säkerhetsrutin, samarbeta över gränser eller
                fatta bättre beslut.
              </p>
            </div>
            <div className="glass-card p-8">
              <h2 className="heading-md mb-4">Så arbetar jag: CLEAR</h2>
              <ol className="space-y-3 body-md list-decimal pl-5">
                <li>
                  <strong>Klargör.</strong> Ambitionen översätts till ett observerbart beteende med
                  utgångsvärde och mål.
                </li>
                <li>
                  <strong>Kartlägg hävstänger.</strong> Med COM-B och en systemkarta hittar vi var en
                  liten insats flyttar beteendet mest.
                </li>
                <li>
                  <strong>Experimentera.</strong> Standardval, friktion, återkoppling och processdesign
                  testas på en delmängd först.
                </li>
                <li>
                  <strong>Analysera.</strong> Vi mäter faktiskt beteende, inte attityder.
                </li>
                <li>
                  <strong>Förfina.</strong> Det som fungerar skalas, resten läggs ner, och nästa cykel
                  startar.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials + selected work */}
      <section className="pb-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h2 className="heading-md mb-6">Bakgrund</h2>
              <ul className="space-y-3 body-md">
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                  <span>
                    {PROFILE.education.degreeSv}, {PROFILE.education.schoolSv}
                  </span>
                </li>
                {PROFILE.roles.map((role) => (
                  <li key={role.sv} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                    <span>{role.sv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-8">
              <h2 className="heading-md mb-6">Utvalda uppdrag</h2>
              <ul className="space-y-3 body-md">
                {PROFILE.selectedWork.map((item) => (
                  <li key={item.sv} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                    <span>
                      {item.sv}
                      {item.url && (
                        <>
                          {" "}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                          >
                            {item.urlLabel?.sv ?? "Källa"}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/60 mt-4">
                {PROFILE.clientsNote.sv} Branscher: {PROFILE.sectors.sv.join(", ").toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking + media */}
      <section className="pb-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h2 className="heading-md mb-6">Föreläsningar</h2>
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
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/60 mt-4">{PROFILE.speakingNote.sv}</p>
            </div>
            <div className="glass-card p-8">
              <h2 className="heading-md mb-6">Media och publikationer</h2>
              <ul className="space-y-3 body-md">
                {PROFILE.media.map((item) => (
                  <li key={item.sv} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0"></div>
                    <span>{item.sv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — plain <dl> so crawlers read it without JS */}
      <section className="pb-16">
        <div className="section-container max-w-4xl mx-auto">
          <h2 className="heading-md text-center mb-10">Vanliga frågor</h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="glass-card p-6 md:p-8">
                <dt className="text-lg font-bold mb-2">{faq.question}</dt>
                <dd className="text-foreground/70 leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="section-container max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center bg-primary/5">
            <h2 className="heading-md mb-4">Vill du prata om ett beteende ni behöver ändra?</h2>
            <p className="body-md max-w-2xl mx-auto mb-8">
              Boka ett kostnadsfritt inledande samtal, så går vi igenom er situation och om CLEAR är rätt
              väg. {PROFILE.team.sv}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book-call" className="btn-primary text-lg px-8 py-3">
                Boka ett samtal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-3"
              >
                LinkedIn
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-foreground/50 mt-6">
              <Link to={EN_PATH} className="hover:text-foreground" lang="en">
                Read this page in English
              </Link>
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};

export default BeteendedesignForandringsledning;
