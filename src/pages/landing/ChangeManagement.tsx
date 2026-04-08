
import LandingPage from "@/components/LandingPage";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ChangeManagement = () => {
  return (
    <LandingPage
      headline="Your Change Initiative Has a 70% Chance of Failing. Here's the Psychology Behind Why."
      subheadline="Most change programs are designed by strategists. They fail because of psychology. A licensed psychologist's framework changes the odds."
      problemStatements={[
        "Your change program looked great on paper — but the organization isn't moving",
        "Leadership is aligned at the top, yet middle management and frontline teams resist or disengage",
        "You've tried workshops, town halls, and communication plans — nothing sticks because the real behavioral barriers are invisible",
      ]}
      solutionText="The CLEAR Change Framework approaches organizational change the way a psychologist approaches behavior change — by understanding what actually drives people. Built on five phases (Clarity, Leverage, Experimentation, Analysis, Refinement), CLEAR combines behavioral science with systems thinking to surface hidden resistance, find the real leverage points, and create change that lasts beyond the project timeline."
      testimonial={{
        quote:
          "What sets Erik apart is his ability to combine psychological insight with practical business acumen. Through our project together we created long term solutions for complex sustainability issues, and proved its efficiency.",
        author: "CCO",
        role: "Housing Organisation",
      }}
      ctaText="Book a Free 30-Minute Discovery Call"
      ctaLink={BOOKING_URL}
      showWhitepaperForm={false}
      seoTitle="Change Management Consulting | Licensed Psychologist | CLEAR Framework"
      seoDescription="70% of change initiatives fail. Licensed psychologist Erik Bohjort uses the CLEAR framework to help organizations drive change that actually sticks. Book a free discovery call."
      seoPath="/lp/change-management"
    />
  );
};

export default ChangeManagement;
