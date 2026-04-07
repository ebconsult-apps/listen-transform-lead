import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const SustainabilityChangeManagement = () => (
  <NichePage
    seoTitle="Sustainability Change Management | ESG Transformation | CLEAR Framework"
    seoDescription="Turn ESG mandates into competitive advantage with psychology-backed change management. The CLEAR framework drives authentic sustainability transformation by aligning environmental goals with operational reality and employee engagement."
    seoPath="/consulting/sustainability-change-management"
    heroTag="Sustainability & ESG"
    headline="Driving Sustainability Through Organizational Change"
    subheadline="Turn ESG mandates into competitive advantage with the CLEAR framework. Sustainability transformation fails when it stays in the strategy department. Real change requires shifting behavior across every level of the organization\u2014and that's a psychological challenge, not just a technical one."
    challengeTitle="The Sustainability Challenge"
    challenges={[
      {
        title: "Sustainability Goals Disconnected from Operations",
        description:
          "Many organizations have ambitious sustainability targets set by leadership, but the operational teams responsible for delivering on them weren't consulted, don't understand the implications, and haven't been given the tools or authority to change how they work. The result is a gap between corporate commitments and operational reality that widens every reporting cycle.",
      },
      {
        title: "Employee Engagement in ESG Initiatives",
        description:
          "Sustainability programs often land as another top-down mandate in a long list of initiatives. Employees see the posters and attend the webinar, but nothing changes in their daily work. Genuine engagement requires more than awareness campaigns\u2014it requires making sustainability relevant to people's specific roles and giving them agency to contribute meaningfully.",
      },
      {
        title: "Measuring Real Impact vs. Greenwashing",
        description:
          "The gap between reported sustainability metrics and actual environmental impact is a growing reputational and regulatory risk. Organizations need measurement frameworks that capture genuine behavioral and operational change, not just the easily quantifiable outputs that look good in annual reports but mask unchanged underlying practices.",
      },
      {
        title: "EU CSRD Compliance as a Change Driver",
        description:
          "The Corporate Sustainability Reporting Directive requires detailed disclosure of sustainability impacts, risks, and strategies. This isn't just a reporting exercise\u2014it requires organizations to actually understand and manage their sustainability performance across value chains. Companies that treat CSRD as a compliance checkbox will miss the strategic opportunity it creates.",
      },
    ]}
    solutionTitle="How CLEAR Drives Authentic Sustainability"
    solutions={[
      {
        title: "Aligning Sustainability with Business Strategy",
        description:
          "CLEAR's Clarity phase doesn't treat sustainability as a separate initiative bolted onto the business strategy. It integrates environmental and social objectives with commercial objectives, finding the intersections where sustainability investments also drive business value. When operational managers see sustainability as part of their performance objectives rather than an additional burden, commitment follows.",
      },
      {
        title: "Systems Mapping Finds ESG Leverage Points",
        description:
          "Sustainability challenges are systemic by nature\u2014carbon footprints span supply chains, resource consumption crosses departmental boundaries, and social impact ripples through communities. CLEAR's Leverage phase maps these systems to identify where organizational changes create the largest environmental and social returns. This prevents the common trap of investing heavily in visible but low-impact initiatives while ignoring the structural changes that would matter most.",
      },
      {
        title: "Building Authentic, Not Performative, Sustainability",
        description:
          "CLEAR's iterative approach\u2014Experimentation followed by Analysis followed by Refinement\u2014builds sustainability practices that are tested and validated, not assumed. Each change is measured for genuine impact, not just compliance. This creates an evidence base that distinguishes authentic transformation from performative sustainability, protecting your organization from greenwashing accusations while building practices that actually reduce environmental harm.",
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
      name: "Sustainability Change Management",
      description:
        "ESG and sustainability transformation consulting using the CLEAR Change Framework to drive authentic organizational change.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      serviceType: "Sustainability Change Management",
      url: "https://clear-framework.com/consulting/sustainability-change-management",
    }}
  />
);

export default SustainabilityChangeManagement;
