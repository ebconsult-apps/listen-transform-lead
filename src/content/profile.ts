/**
 * Erik Bohjort's public profile: the verifiable facts that the About page, the
 * Swedish entity page, the structured data and the site summary all draw on.
 * Keep this the single source so every surface says the same thing.
 *
 * Everything here was supplied by Erik or verified against a public source
 * (LinkedIn, ap7.se, internetdagarna.se, energimyndigheten.se, svt.se).
 * The EU Parliament work is deliberately listed among publications rather
 * than headlined.
 */

export interface Talk {
  event: string;
  year?: string;
  topic?: string;
  url?: string;
}

/** Public talks, most recent first. Typed separately so optional fields stay optional. */
export const SPEAKING: Talk[] = [
  { event: "Stockholm Furniture Fair", year: "2024" },
  { event: "Förvaltardagarna", year: "2024" },
  {
    event: "Internetdagarna",
    year: "2023",
    topic: "Digitala beteenden: verktygen som tar dig från insikt till förändring",
    url: "https://internetdagarna.se/event/digitala-beteenden-verktygen-som-tar-dig-fran-insikt-till-forandring/",
  },
  {
    event: "AP7 Såfa, Tänkonomi",
    topic: "Decisions, thinking errors and horoscopes",
    url: "https://www.ap7.se/tankonomi/artikel-1-tankonomi/",
  },
];

export const PROFILE = {
  name: "Erik Bohjort",
  firstName: "Erik",
  headline: "Licensed psychologist and behavioural design specialist",
  headlineSv: "Legitimerad psykolog och specialist på beteendedesign",
  location: "Stockholm, Sweden",
  email: "erik@eb-consulting.se",
  company: "EB Consulting",
  linkedin: "https://www.linkedin.com/in/erikbohjort/",
  twitter: "https://twitter.com/erikbohjort",

  education: {
    degree: "Licensed psychologist (legitimerad psykolog)",
    degreeSv: "Legitimerad psykolog",
    school: "Uppsala University",
    schoolSv: "Uppsala universitet",
    schoolUrl: "https://www.uu.se/",
  },

  /** Current roles and standing appointments. */
  roles: [
    {
      en: "Member of the Swedish Energy Agency's (Energimyndigheten) expert board on behavioural design",
      sv: "Ledamot i Energimyndighetens expertråd för beteendedesign",
    },
    {
      en: "Teaches behavioural design at specialist level for psychologists, in a specialist course accredited by the Swedish Psychological Association (Sveriges Psykologförbund)",
      sv: "Undervisar i beteendedesign på specialistnivå för psykologer, i en specialistkurs ackrediterad av Sveriges Psykologförbund",
    },
    {
      en: "Co-founder of an award-winning deep-tech psychometrics startup",
      sv: "Medgrundare av en prisbelönt deep tech-startup inom psykometri",
    },
    {
      en: "Creator of the CLEAR Change Framework and founder of EB Consulting",
      sv: "Upphovsman till CLEAR Change Framework och grundare av EB Consulting",
    },
  ],

  /** Engagements Erik is proudest of, described without naming the client. */
  selectedWork: [
    {
      en: "More than doubled subscriptions for one of the largest newspapers in the EU by redesigning the subscription journey around how readers actually decide.",
      sv: "Mer än fördubblade prenumerationerna för en av EU:s största dagstidningar genom att designa om prenumerationsresan utifrån hur läsare faktiskt fattar beslut.",
    },
    {
      en: "Led the largest behavioural survey on energy demand flexibility in the EU: a study of more than 2,500 single-family homeowners' electricity use for the Swedish Energy Agency, and authored the agency's report on energy flexibility.",
      sv: "Ledde EU:s största beteendestudie om efterfrågeflexibilitet på el: en undersökning av mer än 2 500 villaägares elanvändning för Energimyndigheten, och författade myndighetens rapport om energiflexibilitet.",
    },
    {
      en: "Designed the behavioural side of a car-pool launch together with Chalmers Industriteknik.",
      sv: "Utformade beteendedelen i lanseringen av en bilpool tillsammans med Chalmers Industriteknik.",
    },
  ],

  /** Public-sector clients Erik has agreed to name. Private-sector clients stay unnamed. */
  publicClients: [
    { name: "Arbetsförmedlingen", en: "the Swedish Public Employment Service" },
    { name: "Försäkringskassan", en: "the Swedish Social Insurance Agency" },
    { name: "Energimyndigheten", en: "the Swedish Energy Agency" },
  ],
  clientsNote: {
    en: "Public-sector clients include Arbetsförmedlingen (the Swedish Public Employment Service), Försäkringskassan (the Swedish Social Insurance Agency) and the Swedish Energy Agency. Private-sector clients are not named here.",
    sv: "Bland uppdragsgivare i offentlig sektor finns Arbetsförmedlingen, Försäkringskassan och Energimyndigheten. Privata kunder namnges inte här.",
  },

  /** Sectors Erik works in (private-sector clients are not named). */
  sectors: {
    en: [
      "Energy and utilities",
      "Pensions and financial services",
      "News media and publishing",
      "Digital product and service design",
      "Public agencies and EU policy",
      "Retail and consumer brands",
      "Deep tech and startups",
    ],
    sv: [
      "Energi",
      "Pension och finans",
      "Media och dagspress",
      "Digital produkt- och tjänstedesign",
      "Myndigheter och EU-politik",
      "Handel och konsumentvarumärken",
      "Deep tech och startups",
    ],
  },

  speaking: SPEAKING,
  speakingNote: {
    en: "Plus internal conferences and leadership meetings in the energy, pension and digital design sectors since 2020.",
    sv: "Därtill interna konferenser och ledningsmöten inom energi, pension och digital design sedan 2020.",
  },

  media: [
    {
      en: "SVT national news: interviewed on behavioural design for societal benefit (2024)",
      sv: "SVT Nyheter: intervjuad om samhällsnyttig beteendedesign (2024)",
    },
    {
      en: "Dagens Nyheter: co-authored opinion articles",
      sv: "Dagens Nyheter: medförfattare till debattartiklar",
    },
    {
      en: "Aftonbladet: featured as a psychologist and behavioural expert",
      sv: "Aftonbladet: medverkat som psykolog och beteendeexpert",
    },
    {
      en: "The Sun (UK): featured as a psychologist and behavioural expert",
      sv: "The Sun (Storbritannien): medverkat som psykolog och beteendeexpert",
    },
    {
      en: "Swedish Energy Agency: author of the report on energy flexibility",
      sv: "Energimyndigheten: författare till rapporten om energiflexibilitet",
    },
    {
      en: "Picadeli: co-author of the Vegocracy report",
      sv: "Picadeli: medförfattare till rapporten Vegocracy",
    },
    {
      en: "Co-author of a report on workplace culture and remote work after the pandemic",
      sv: "Medförfattare till en rapport om företagskultur och distansarbete efter pandemin",
    },
    {
      en: "SEOM: co-authored articles on sustainable everyday behaviour",
      sv: "SEOM: medförfattare till artiklar om hållbara vardagsbeteenden",
    },
    {
      en: "European Parliament: co-authored reports on reducing single-use plastics",
      sv: "Europaparlamentet: medförfattare till rapporter om minskad användning av engångsplast",
    },
  ],

  team: {
    en: "Erik leads every engagement personally and brings in senior consultants from his network, as subcontractors, when the scope calls for it.",
    sv: "Jag leder varje uppdrag personligen och tar in seniora konsulter ur mitt nätverk som underkonsulter när omfattningen kräver det.",
  },
} as const;

export const PERSON_ID = "https://clear-framework.com/about#person";
export const ORG_ID = "https://clear-framework.com/#organization";

/** Shared Person JSON-LD, embedded by the About page and referenced by @id elsewhere. */
export function personJsonLd(lang: "en" | "sv" = "en") {
  const sv = lang === "sv";
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PROFILE.name,
    jobTitle: sv
      ? "Legitimerad psykolog och konsult inom beteendedesign och förändringsledning"
      : "Licensed Psychologist & Behaviour Change Consultant",
    description: sv
      ? "Legitimerad psykolog (Uppsala universitet) och specialist på beteendedesign, baserad i Stockholm. Grundare av EB Consulting och upphovsman till CLEAR Change Framework."
      : "Licensed psychologist (Uppsala University) and behavioural design specialist based in Stockholm, Sweden. Founder of EB Consulting and creator of the CLEAR Change Framework.",
    url: "https://clear-framework.com/about",
    image: "https://clear-framework.com/erik-portrait.jpg",
    email: PROFILE.email,
    sameAs: [PROFILE.linkedin, PROFILE.twitter],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: sv ? PROFILE.education.schoolSv : PROFILE.education.school,
      url: PROFILE.education.schoolUrl,
    },
    hasOccupation: {
      "@type": "Occupation",
      name: sv ? "Legitimerad psykolog" : "Licensed Psychologist",
      occupationLocation: { "@type": "Country", name: sv ? "Sverige" : "Sweden" },
    },
    affiliation: [
      {
        "@type": "GovernmentOrganization",
        name: sv ? "Energimyndigheten, expertråd för beteendedesign" : "Swedish Energy Agency, expert board on behavioural design",
        url: "https://www.energimyndigheten.se/",
      },
    ],
    worksFor: {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: PROFILE.company,
      url: "https://clear-framework.com",
    },
    workLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Stockholm", addressCountry: "SE" },
    },
    knowsLanguage: ["sv", "en"],
    knowsAbout: sv
      ? [
          "Beteendedesign",
          "Beteendeförändring",
          "Förändringsledning",
          "Beteendevetenskap",
          "Nudging",
          "COM-B",
          "Organisationspsykologi",
          "Psykometri",
          "Systemtänkande",
        ]
      : [
          "Behaviour change",
          "Behavioural design and nudging",
          "Behavioral science",
          "Change management",
          "COM-B model",
          "Organizational psychology",
          "Psychometrics",
          "Systems thinking",
        ],
  };
}
