
import LandingPage from "@/components/LandingPage";
import WhitepaperGate from "@/components/WhitepaperGate";

const ClearWhitepaper = () => {
  return (
    <LandingPage
      headline="The Psychology-Backed Framework That Makes Change Stick"
      subheadline="Download the CLEAR Change Framework Whitepaper"
      problemStatements={[
        "You've tried change programs before \u2014 and they fizzled out within months",
        "Your team is skeptical of yet another top-down initiative",
        "You need a structured approach that actually works with human behavior, not against it",
      ]}
      solutionText="The CLEAR framework is built on behavioral psychology and systems thinking. It gives you a repeatable, evidence-based process for driving change that people actually buy into \u2014 because they helped shape it."
      ctaText="Download the Whitepaper"
      ctaLink="#"
      showWhitepaperForm={true}
      seoTitle="Download the CLEAR Change Framework Whitepaper | Free PDF"
      seoDescription="Get the comprehensive guide to the CLEAR methodology. Learn the 5-step process for organizational change backed by behavioral psychology and systems thinking."
      seoPath="/lp/clear-whitepaper"
    >
      <WhitepaperGate
        title="The CLEAR Change Framework"
        description="A comprehensive guide to the CLEAR methodology \u2014 from theoretical foundations to practical implementation."
        highlights={[
          "Understand the complete 5-step CLEAR process",
          "Learn how to apply systems thinking to organizational challenges",
          "Get actionable templates for running CLEAR workshops",
        ]}
        pdfUrl="/whitepapers/clear-change-framework.pdf"
        whitepaperIdentifier="clear-change-framework"
      />
    </LandingPage>
  );
};

export default ClearWhitepaper;
