
import LandingPage from "@/components/LandingPage";
import WhitepaperGate from "@/components/WhitepaperGate";

const Sustainability = () => {
  return (
    <LandingPage
      headline="Turn ESG Mandates Into Competitive Advantage"
      subheadline="Download the free whitepaper on driving sustainable change with the CLEAR framework"
      problemStatements={[
        "Sustainability targets feel disconnected from day-to-day operations",
        "Employee engagement in ESG initiatives is low \u2014 it feels like a checkbox exercise",
        "You need a framework that integrates sustainability into how you actually work",
      ]}
      solutionText="The CLEAR framework helps organizations embed sustainability into operations, culture, and strategy. By using systems mapping to find real leverage points and iterative experimentation to build momentum, you can turn compliance into competitive advantage."
      ctaText="Download the Sustainability Whitepaper"
      ctaLink="#"
      showWhitepaperForm={true}
      seoTitle="Sustainable Change with the CLEAR Framework | Free Whitepaper"
      seoDescription="Learn how to embed sustainability into operations, culture, and strategy. Download the free CLEAR sustainability whitepaper."
      seoPath="/lp/sustainability"
    >
      <WhitepaperGate
        title="Driving Sustainable Change Inside and Out"
        description="How organizations can use the CLEAR framework to embed sustainability into operations, culture, and strategy."
        highlights={[
          "Align sustainability with business strategy",
          "Use systems mapping to identify ESG leverage points",
          "Build lasting sustainable practices through iterative change",
        ]}
        pdfUrl="/whitepapers/clear-sustainability.pdf"
        whitepaperIdentifier="clear-sustainability"
      />
    </LandingPage>
  );
};

export default Sustainability;
