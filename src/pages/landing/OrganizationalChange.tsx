
import LandingPage from "@/components/LandingPage";

const OrganizationalChange = () => {
  return (
    <LandingPage
      headline="Is Your Organization Stuck in a Cycle of Failed Change?"
      subheadline="Most change programs fail because they treat symptoms, not systems. The CLEAR framework takes a different approach."
      problemStatements={[
        "70% of change initiatives fail to deliver their intended results",
        "Teams resist top-down mandates that ignore their lived experience",
        "Complex challenges don't have simple solutions \u2014 yet most frameworks pretend they do",
      ]}
      solutionText="The CLEAR Change Framework combines behavioral psychology with systems thinking to drive change that actually sticks. Built on five proven steps \u2014 Clarity, Landscape, Experimentation, Adaptation, and Results \u2014 CLEAR helps you understand the real dynamics at play and engage the people who matter most."
      ctaText="Book a Free Discovery Call"
      ctaLink="/contact"
      showWhitepaperForm={false}
      seoTitle="Organizational Change That Works | CLEAR Framework"
      seoDescription="Stop the cycle of failed change initiatives. The CLEAR framework combines behavioral psychology and systems thinking for lasting organizational transformation."
      seoPath="/lp/organizational-change"
    />
  );
};

export default OrganizationalChange;
