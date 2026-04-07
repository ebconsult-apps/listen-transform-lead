import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const OrganizationalPsychologyConsulting = () => (
  <NichePage
    seoTitle="Organizational Psychology Consultant | Licensed Psychologist | CLEAR Framework"
    seoDescription="Organizational psychology consulting from a licensed psychologist. The CLEAR framework applies behavioral science, psychometric assessment, and evidence-based intervention design to deliver measurable organizational transformation."
    seoPath="/consulting/organizational-psychology-consulting"
    heroTag="Evidence-Based"
    headline="Organizational Psychology Consulting"
    subheadline="Where behavioral science meets business transformation. The CLEAR framework is built on organizational psychology principles, delivered by a licensed psychologist who understands both the science of human behavior and the realities of business."
    challengeTitle="Why Organizations Need Psychology"
    challenges={[
      {
        title: "Change Resistance Rooted in Psychology",
        description:
          "Most change programs treat resistance as a communications problem\u2014if only we explain better, people will get on board. But resistance is a psychological phenomenon driven by threat perception, identity disruption, and loss aversion. Addressing it requires understanding the behavioral mechanisms underneath, not just crafting better slide decks.",
      },
      {
        title: "Leadership Blind Spots",
        description:
          "Leaders operate within cognitive frameworks that filter what they see and how they interpret it. Confirmation bias, the Dunning-Kruger effect, and groupthink are not character flaws\u2014they are predictable patterns that affect every leadership team. Without structured psychological assessment, these blind spots become organizational blind spots.",
      },
      {
        title: "Culture That Undermines Strategy",
        description:
          "Organizations regularly launch strategies that their culture quietly kills. The espoused values on the wall and the actual behavioral norms in corridors are often misaligned. Diagnosing this gap requires tools from organizational psychology, not management consulting frameworks that take culture at face value.",
      },
      {
        title: "Measuring Behavioral Change",
        description:
          "Surveys measure attitudes, not behavior. Most organizations track whether people say they support a change, not whether they've actually changed how they work. Meaningful measurement of organizational change requires psychometric rigor and behavioral observation methods that most consulting firms simply don't possess.",
      },
    ]}
    solutionTitle="How Psychology Powers the CLEAR Framework"
    solutions={[
      {
        title: "Licensed Psychologist Bringing Clinical-Grade Assessment",
        description:
          "CLEAR isn't a repackaged business framework with a psychology label. It's designed by a licensed psychologist with clinical training in behavioral assessment. The Clarity phase uses structured diagnostic methods adapted from clinical psychology to surface the real dynamics driving organizational behavior\u2014not the sanitized version that appears in leadership meetings.",
      },
      {
        title: "Behavioral Design Principles Built Into Every Phase",
        description:
          "Each CLEAR phase incorporates specific behavioral science principles. The Leverage phase applies systems psychology to identify behavioral feedback loops. The Experimentation phase uses principles from behavioral economics\u2014nudge design, default architecture, commitment devices\u2014to create interventions that work with human nature rather than against it.",
      },
      {
        title: "Psychometric Tools for Measuring Real Change",
        description:
          "CLEAR's Analysis phase goes beyond satisfaction surveys. It employs validated psychometric instruments and behavioral observation protocols to measure whether organizational behavior has actually shifted. This means you get evidence of real change, not just evidence that people know the right answers to give on a questionnaire.",
      },
      {
        title: "Evidence-Based, Not Opinion-Based",
        description:
          "Every recommendation in a CLEAR engagement is grounded in peer-reviewed research from organizational psychology, behavioral economics, and systems theory. When we suggest an intervention, we can point to the evidence base supporting it. This isn't about what feels right or what worked at another company\u2014it's about what the science shows actually drives behavior change.",
      },
    ]}
    ctaPrimary={{ text: "Book a Free Discovery Call", href: BOOKINGS_URL }}
    ctaSecondary={{
      text: "Take the Change Readiness Assessment",
      href: "/assessment",
    }}
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Organizational Psychology Consulting",
      description:
        "Evidence-based organizational psychology consulting from a licensed psychologist using the CLEAR Change Framework.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Professional License",
            name: "Licensed Psychologist",
          },
        },
      },
      serviceType: "Organizational Psychology Consulting",
      url: "https://clear-framework.com/consulting/organizational-psychology-consulting",
    }}
  />
);

export default OrganizationalPsychologyConsulting;
