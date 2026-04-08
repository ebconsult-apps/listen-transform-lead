
import LandingPage from "@/components/LandingPage";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const LeadershipDevelopment = () => {
  return (
    <LandingPage
      headline="Leadership Development That Goes Deeper Than Any Workshop"
      subheadline="Psychology-backed programs that change how leaders think and act — not just what they know."
      problemStatements={[
        "Your leaders attended the workshop, got the certificate, and went back to doing exactly what they did before",
        "Leadership assessments sit in a drawer — no one connects the data to actual development plans or behavioral change",
        "You need leaders who can navigate complexity, not just execute playbooks — but most programs don't develop that capacity",
      ]}
      solutionText="Erik Bohjort is a licensed psychologist who designs leadership development around how people actually change — not how we wish they would. Using psychometric assessments, evidence-based coaching, and the CLEAR framework, each program is tailored to your leaders' real behavioral patterns and your organization's strategic challenges. The result: measurable shifts in how leaders operate under pressure, make decisions, and build trust."
      testimonial={{
        quote:
          "Through his thorough and empathetic approach, Erik helped our team find a new path forward with our product strategy.",
        author: "CEO",
        role: "Deep Tech Startup",
      }}
      ctaText="Book a Free 30-Minute Discovery Call"
      ctaLink={BOOKING_URL}
      showWhitepaperForm={false}
      seoTitle="Leadership Development Program | Licensed Psychologist | Evidence-Based"
      seoDescription="Leadership workshops don't change behavior. Licensed psychologist Erik Bohjort designs evidence-based leadership programs using psychometric assessments and the CLEAR framework."
      seoPath="/lp/leadership-development"
    />
  );
};

export default LeadershipDevelopment;
