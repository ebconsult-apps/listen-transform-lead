
import LandingPage from "@/components/LandingPage";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const OrganizationalPsychology = () => {
  return (
    <LandingPage
      headline="When Your Organization Needs a Psychologist, Not Another Consultant"
      subheadline="Behavioral design and psychometric assessments from a licensed psychologist — not a weekend-certified coach."
      problemStatements={[
        "You've hired consultants before — they delivered a slide deck and left. The underlying behavioral patterns didn't change.",
        "Your culture assessment says one thing, but how people actually behave says another — and no one can explain the gap",
        "You need someone who understands confirmation bias, groupthink, and resistance at a clinical level — not someone who read a pop-psychology book",
      ]}
      solutionText="Erik Bohjort brings clinical-grade psychological expertise to organizational challenges. As a licensed psychologist — not a coach, not a consultant, but a formally trained behavioral scientist — Erik uses psychometric assessments, behavioral design principles, and the CLEAR framework to diagnose what's really happening in your organization and design interventions that address root causes, not symptoms. The difference: measurable behavioral change backed by peer-reviewed methodology."
      testimonial={{
        quote:
          "With Erik's guidance, we transformed our HR-data strategy, resulting in a breakthrough deal that exceeded our expectations.",
        author: "CEO",
        role: "International Healthcare Provider",
      }}
      ctaText="Book a Free 30-Minute Discovery Call"
      ctaLink={BOOKING_URL}
      showWhitepaperForm={false}
      seoTitle="Organizational Psychology Consultant | Behavioral Design | Psychometric Assessments"
      seoDescription="Licensed psychologist Erik Bohjort applies clinical-grade behavioral science to organizational challenges. Psychometric assessments, behavioral design, and evidence-based change."
      seoPath="/lp/organizational-psychology"
    />
  );
};

export default OrganizationalPsychology;
