import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import AssessmentResults from "@/components/AssessmentResults";
import type { AssessmentData } from "@/components/AssessmentQuiz";

const Assessment = () => {
  const [showResults, setShowResults] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (showResults) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showResults]);

  const handleComplete = (results: AssessmentData) => {
    setAssessmentData(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Change Readiness Assessment | CLEAR Change Framework"
        description="Take this free 2-minute assessment to discover how ready your organization is for meaningful transformation. Get personalized insights based on the CLEAR Change Framework."
        path="/assessment"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Change Readiness Assessment",
          "description": "Free organizational change readiness self-assessment based on the CLEAR Change Framework",
          "url": "https://clear-framework.com/assessment",
          "provider": {
            "@type": "ProfessionalService",
            "name": "EB Consulting",
            "founder": { "@type": "Person", "name": "Erik Bohjort" },
          },
        }}
      />

      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          {!showResults ? (
            <>
              <div className="text-center mb-12">
                <div className="tag mb-4">Diagnostic Tool</div>
                <h1 className="heading-xl mb-6">How Ready Is Your Organization for Change?</h1>
                <p className="body-lg max-w-2xl mx-auto mb-4">
                  Most change initiatives fail not because the strategy is wrong, but because
                  the organization isn't ready. This diagnostic helps you identify where your
                  strengths and blind spots lie across five critical dimensions.
                </p>
                <p className="text-sm text-foreground/50">
                  5 diagnostic questions &middot; then a few about your context &middot; instant insights
                </p>
              </div>
              <AssessmentQuiz onComplete={handleComplete} />
            </>
          ) : (
            <>
              <div className="text-center mb-12">
                <div className="tag mb-4">Your Results</div>
                <h1 className="heading-xl mb-6">Your Change Readiness Results</h1>
              </div>
              {assessmentData && <AssessmentResults data={assessmentData} />}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Assessment;
