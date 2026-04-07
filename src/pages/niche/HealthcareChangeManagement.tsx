import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const HealthcareChangeManagement = () => (
  <NichePage
    seoTitle="Healthcare Change Management | Patient-Centered Transformation | CLEAR Framework"
    seoDescription="Change management consulting for healthcare organizations. The CLEAR framework combines clinical psychology expertise with systematic transformation methodology to improve patient outcomes while reducing clinician burden."
    seoPath="/consulting/healthcare-change-management"
    heroTag="Healthcare"
    headline="Change Management for Healthcare Organizations"
    subheadline="Patient-centered transformation backed by clinical psychology expertise. Healthcare organizations face unique pressures that generic change management cannot address. The CLEAR framework speaks the language of clinical evidence while delivering operational transformation."
    challengeTitle="The Healthcare Challenge"
    challenges={[
      {
        title: "Clinician Burnout and Resistance to Administrative Change",
        description:
          "Healthcare professionals are exhausted. Years of increasing administrative burden, staffing shortages, and pandemic recovery have left clinicians with zero tolerance for change initiatives that feel disconnected from patient care. Any transformation that adds friction to clinical workflows will be rejected\u2014and clinicians have both the autonomy and the moral authority to resist.",
      },
      {
        title: "Patient Safety During Transitions",
        description:
          "In healthcare, organizational change carries risks that don't exist in other industries. A poorly managed transition in clinical workflows, handoff procedures, or information systems can directly affect patient safety. Change management in healthcare isn't just about organizational effectiveness\u2014it's about protecting the people who depend on the system working correctly.",
      },
      {
        title: "Regulatory Compliance Under Transformation",
        description:
          "Healthcare organizations operate under layers of regulation\u2014EU Medical Device Regulation, patient data protection, clinical governance frameworks, accreditation standards. Every change must be evaluated not just for effectiveness but for compliance. This creates a natural conservatism that makes transformation slower and more complex than in unregulated industries.",
      },
      {
        title: "Cross-Departmental Silos",
        description:
          "Hospitals and healthcare systems are organized around clinical specialties, each with its own culture, priorities, and power structures. Transformation that requires cross-departmental collaboration\u2014and most meaningful healthcare improvement does\u2014must navigate professional hierarchies, departmental politics, and deeply ingrained territorial behavior.",
      },
    ]}
    solutionTitle="How CLEAR Transforms Healthcare"
    solutions={[
      {
        title: "Psychology Credentials Bring Credibility with Clinical Staff",
        description:
          "Healthcare professionals are trained to evaluate evidence and credentials. A change consultant without clinical or scientific background faces immediate skepticism. CLEAR is delivered by a licensed psychologist whose training in assessment, behavioral science, and research methodology resonates with clinicians. This shared commitment to evidence creates a foundation of credibility that generic management consultants cannot establish.",
      },
      {
        title: "Clarity Phase Aligns Around Patient Outcomes",
        description:
          "CLEAR's Clarity phase frames transformation objectives in terms that clinicians care about: patient outcomes, care quality, and clinical effectiveness. When the stated goal of change is improving patient experience rather than cutting costs, clinical staff engage differently. The framework structures this alignment through collaborative workshops where frontline clinicians help define what success looks like in terms meaningful to their daily practice.",
      },
      {
        title: "Experimentation Enables Safe Piloting",
        description:
          "CLEAR's Experimentation phase is designed for high-stakes environments. In healthcare, this means testing changes in controlled conditions\u2014a single ward, a specific patient pathway, a limited time period\u2014with rigorous monitoring of both intended and unintended effects. Clinical staff participate in designing safety parameters for each pilot, and the Analysis phase uses methods familiar to anyone with clinical research training.",
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
      name: "Healthcare Change Management",
      description:
        "Patient-centered change management consulting for healthcare organizations, delivered by a licensed psychologist using the CLEAR Change Framework.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      serviceType: "Healthcare Change Management",
      url: "https://clear-framework.com/consulting/healthcare-change-management",
    }}
  />
);

export default HealthcareChangeManagement;
