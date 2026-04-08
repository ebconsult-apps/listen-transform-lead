
import LandingPage from "@/components/LandingPage";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const MergerIntegration = () => {
  return (
    <LandingPage
      headline="Mergers Fail When Leaders Focus on Systems and Forget the People"
      subheadline="A licensed psychologist's approach to post-merger integration — because culture clashes don't resolve in spreadsheets."
      problemStatements={[
        "The deal closed, but two cultures are now at war — and every week of friction is destroying the value you paid for",
        "Your top talent is quietly interviewing elsewhere because no one addressed their anxiety, identity loss, or trust deficit",
        "Integration milestones are green on the dashboard, but the organization feels paralyzed — because the real barriers are psychological, not operational",
      ]}
      solutionText="Post-merger integration is one of the most psychologically complex challenges an organization can face. Erik Bohjort applies clinical-level understanding of group dynamics, identity threat, and trust formation to the integration process. Using the CLEAR framework, he helps leadership teams surface hidden resistance, align competing cultures through structured listening, and build psychological safety fast enough to retain the people who matter most."
      testimonial={{
        quote:
          "What sets Erik apart is his ability to combine psychological insight with practical business acumen. Through our project together we created long term solutions for complex sustainability issues, and proved its efficiency.",
        author: "CCO",
        role: "Housing Organisation",
      }}
      ctaText="Book a Free 30-Minute Discovery Call"
      ctaLink={BOOKING_URL}
      showWhitepaperForm={false}
      seoTitle="Post-Merger Integration Consultant | Psychology-Based M&A Culture Integration"
      seoDescription="Mergers fail when leaders forget the people. Licensed psychologist Erik Bohjort helps organizations navigate post-merger culture integration using clinical behavioral science."
      seoPath="/lp/merger-integration"
    />
  );
};

export default MergerIntegration;
