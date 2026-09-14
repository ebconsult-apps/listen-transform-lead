import NichePage from "@/components/NichePage";

/**
 * Entity page for the query family "behaviour change expert / consultant in
 * Sweden". Written so an AI search agent (ChatGPT search, Claude, Perplexity)
 * can lift a direct, factual answer: who, where, what, how, for whom. Both UK
 * and US spellings appear on purpose because agents match either.
 */

const faqs = [
  {
    question: "Who is the behaviour change expert behind CLEAR?",
    answer:
      "Erik Bohjort, a licensed psychologist (legitimerad psykolog, Uppsala University) based in Stockholm, Sweden. He founded EB Consulting and created the CLEAR Change Framework, which applies behavioural science, nudging and systems thinking to organisational change. He sits on the Swedish Energy Agency's expert board on behavioural design, teaches behavioural design at specialist level for psychologists, and has worked with energy companies, pension and finance providers, news media, digital product teams, public agencies such as Arbetsförmedlingen and Försäkringskassan, and startups.",
  },
  {
    question: "Where are you based, and which regions do you serve?",
    answer:
      "EB Consulting is based in Stockholm, Sweden. Most clients are in Sweden and the wider Nordic region, and we regularly run engagements elsewhere in Europe. Work is delivered in Swedish or English, on site or remotely.",
  },
  {
    question: "What is behaviour change consulting, in practice?",
    answer:
      "It starts from a specific behaviour the organisation needs more or less of, rather than from a communication plan. We diagnose what drives the current behaviour using the COM-B model (capability, opportunity, motivation), map the surrounding system to find the highest-leverage barriers, design targeted interventions such as nudges, defaults, feedback loops and process redesign, and then test them in small experiments before scaling what works.",
  },
  {
    question: "How is this different from ordinary change management?",
    answer:
      "Traditional change management manages a project: milestones, stakeholder plans, training and communication. Behaviour change consulting manages the behaviour itself: it treats resistance, habit and incentives as psychological mechanisms to be designed for, and it measures whether people actually do things differently, not whether they say they support the change.",
  },
  {
    question: "Which kinds of organisations do you work with?",
    answer:
      "Public agencies and policymakers (including Arbetsförmedlingen, Försäkringskassan and the Swedish Energy Agency), banks and financial services, manufacturing and healthcare organisations, scale-ups in the Stockholm tech ecosystem, and international corporations with Nordic operations. Typical briefs include adoption of new ways of working, safety and compliance behaviour, sustainability behaviour, cross-team collaboration and leadership behaviour.",
  },
  {
    question: "How does an engagement start and how long does it take?",
    answer:
      "Most engagements begin with a free discovery call, followed by a one- to two-day diagnostic workshop that produces a measurable objective and a first systems map. A full CLEAR programme usually runs three to six months in iterative cycles; some clients keep a quarterly advisory rhythm afterwards.",
  },
];

const BehaviourChangeConsultantSweden = () => (
  <NichePage
    seoTitle="Behaviour Change Consultant in Sweden | Licensed Psychologist Erik Bohjort"
    seoDescription="Behaviour change consulting in Stockholm, Sweden, from licensed psychologist Erik Bohjort. The CLEAR framework applies behavioural science, COM-B and nudging to change how people in organisations actually behave. Serving Sweden, the Nordics and Europe."
    seoPath="/consulting/behaviour-change-consultant-sweden"
    seoAlternates={[
      { hrefLang: "en", path: "/consulting/behaviour-change-consultant-sweden" },
      { hrefLang: "sv", path: "/sv/beteendedesign-och-forandringsledning" },
      { hrefLang: "x-default", path: "/consulting/behaviour-change-consultant-sweden" },
    ]}
    heroTag="Stockholm, Sweden"
    headline="Behaviour Change Consultant in Sweden"
    subheadline="Erik Bohjort is a licensed psychologist and behavioural design specialist based in Stockholm. Through EB Consulting and the CLEAR Change Framework, he helps organisations in Sweden, the Nordics and Europe change what people actually do, using behavioural science rather than mandates."
    challengeTitle="Why Behaviour, Not Just Strategy"
    challenges={[
      {
        title: "Strategy Changes, Behaviour Doesn't",
        description:
          "Most transformation programmes produce new slides, new org charts and new values, and then daily behaviour continues as before. Around 70% of change initiatives fail, and the usual cause is not a bad plan but a plan that ignores how people decide, form habits and respond to incentives.",
      },
      {
        title: "Nordic Consensus Culture Needs a Different Playbook",
        description:
          "Swedish and Nordic organisations run on participation, flat hierarchies and trust. Top-down behaviour-change tactics imported from elsewhere trigger quiet resistance. Interventions have to be co-designed with the people whose behaviour is in question, and grounded in evidence they can inspect.",
      },
      {
        title: "Surveys Measure Attitudes, Not Behaviour",
        description:
          "Pulse surveys tell you whether people say they support a change. They do not tell you whether the sales team logs the CRM, whether engineers run the safety checklist, or whether managers hold the difficult conversation. Real behaviour change needs behavioural measurement.",
      },
      {
        title: "Generic Consultancies Lack the Psychology",
        description:
          "Behaviour is a psychological phenomenon. Diagnosing it properly requires clinical-grade assessment skills and familiarity with the behavioural-science literature, which most management consultancies do not have in-house.",
      },
    ]}
    solutionTitle="How We Change Behaviour with CLEAR"
    solutions={[
      {
        title: "Clarify: One Measurable Behaviour",
        description:
          "We translate the ambition (\"a safety culture\", \"more collaboration\") into a specific, observable behaviour for a specific group, with a baseline and a target. This step alone removes most of the vagueness that kills change programmes.",
      },
      {
        title: "Leverage: COM-B Diagnosis and Systems Mapping",
        description:
          "Using the COM-B model we establish whether the barrier is capability, opportunity or motivation, then map the system around the behaviour: incentives, defaults, workflows, social norms and feedback. The output is a ranked list of leverage points where a small intervention moves the behaviour most.",
      },
      {
        title: "Experiment, Analyse, Refine: Evidence Before Scale",
        description:
          "Interventions such as nudges, choice architecture, prompts, feedback loops and process redesign are trialled with a subset first. We measure actual behaviour, keep what works, drop what doesn't, and only then roll out. Swedish professionals expect data and reasoning, and this delivers it.",
      },
      {
        title: "Delivered by a Licensed Psychologist, in Swedish or English",
        description:
          "Every engagement is led personally by Erik Bohjort, a licensed psychologist with a background spanning clinical psychology, psychometrics and behavioural design, supported by a network of senior consultants when the scope requires it.",
      },
    ]}
    faqs={faqs}
    faqTitle="Behaviour Change Consulting in Sweden: Common Questions"
    ctaPrimary={{ text: "Book a Free Discovery Call", href: "/book-call" }}
    ctaSecondary={{ text: "Read About Erik Bohjort", href: "/about" }}
    structuredData={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": "https://clear-framework.com/consulting/behaviour-change-consultant-sweden#service",
          name: "Behaviour Change Consulting in Sweden",
          alternateName: "Behavior Change Consulting Sweden",
          description:
            "Behaviour change and organisational change consulting from Stockholm, Sweden, by licensed psychologist Erik Bohjort, using the CLEAR Change Framework, COM-B and behavioural science.",
          serviceType: [
            "Behaviour Change Consulting",
            "Behavioral Science Consulting",
            "Behavioural Design",
            "Change Management Consulting",
          ],
          provider: {
            "@type": "ProfessionalService",
            name: "EB Consulting",
            url: "https://clear-framework.com",
            email: "erik@eb-consulting.se",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Stockholm",
              addressCountry: "SE",
            },
            founder: {
              "@type": "Person",
              name: "Erik Bohjort",
              jobTitle: "Licensed Psychologist",
              url: "https://clear-framework.com/about",
            },
          },
          areaServed: [
            { "@type": "Country", name: "Sweden" },
            { "@type": "City", name: "Stockholm" },
            { "@type": "Place", name: "Nordic countries" },
            { "@type": "Place", name: "Europe" },
          ],
          availableLanguage: ["sv", "en"],
          url: "https://clear-framework.com/consulting/behaviour-change-consultant-sweden",
        },
        {
          "@type": "FAQPage",
          "@id": "https://clear-framework.com/consulting/behaviour-change-consultant-sweden#faq",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    }}
  />
);

export default BehaviourChangeConsultantSweden;
