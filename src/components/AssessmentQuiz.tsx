import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";

export interface AssessmentData {
  orgSize: string;
  role: string;
  challenge: string;
  clarity: number;
  leverage: number;
  experimentation: number;
  analysis: number;
  refinement: number;
  totalScore: number;
}

interface AssessmentQuizProps {
  onComplete: (results: AssessmentData) => void;
}

interface QualifyingQuestion {
  type: "qualifying";
  question: string;
  options: string[];
  key: "orgSize" | "role" | "challenge";
}

interface ScaleQuestion {
  type: "scale";
  question: string;
  lowLabel: string;
  highLabel: string;
  key: "clarity" | "leverage" | "experimentation" | "analysis" | "refinement";
}

type Question = QualifyingQuestion | ScaleQuestion;

const questions: Question[] = [
  // CLEAR readiness questions first — the real diagnostic value
  {
    type: "scale",
    question: "How clearly defined and shared are your change objectives across the organization?",
    lowLabel: "No clear objectives",
    highLabel: "Crystal clear, widely shared",
    key: "clarity",
  },
  {
    type: "scale",
    question: "How well do you understand the key system dynamics and leverage points affecting your goals?",
    lowLabel: "We don't map our systems",
    highLabel: "Deep systemic understanding",
    key: "leverage",
  },
  {
    type: "scale",
    question: "How comfortable is your organization with running small-scale experiments before committing to large changes?",
    lowLabel: "We go all-in or not at all",
    highLabel: "Experimentation is in our DNA",
    key: "experimentation",
  },
  {
    type: "scale",
    question: "How rigorously does your organization measure outcomes and reflect on what's working?",
    lowLabel: "Rarely measure or reflect",
    highLabel: "Data-driven reflection culture",
    key: "analysis",
  },
  {
    type: "scale",
    question: "How effectively does your organization incorporate learnings into continuous improvement?",
    lowLabel: "Learnings get lost",
    highLabel: "Systematic learning loops",
    key: "refinement",
  },
  // Context questions after — now they've gotten value, they're invested
  {
    type: "qualifying",
    question: "What is your organization's most pressing challenge right now?",
    options: [
      "Culture & Collaboration",
      "Operational Efficiency",
      "Digital Transformation & AI",
      "M&A / Restructuring",
      "Sustainability & ESG",
      "Growth & Scaling",
    ],
    key: "challenge",
  },
  {
    type: "qualifying",
    question: "What best describes your role?",
    options: ["C-Suite / Executive", "VP / Director", "Manager / Team Lead", "Consultant / Advisor", "Other"],
    key: "role",
  },
  {
    type: "qualifying",
    question: "What is the size of your organization?",
    options: ["1-50 employees", "51-200 employees", "201-1,000 employees", "1,000+ employees"],
    key: "orgSize",
  },
];

const AssessmentQuiz = ({ onComplete }: AssessmentQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = questions.length;
  const current = questions[currentStep];

  const advance = useCallback(
    (key: string, value: string | number) => {
      const updated = { ...answers, [key]: value };
      setAnswers(updated);
      setIsTransitioning(true);

      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((s) => s + 1);
          setIsTransitioning(false);
        } else {
          // Build results
          const clarity = updated.clarity as number;
          const leverage = updated.leverage as number;
          const experimentation = updated.experimentation as number;
          const analysis = updated.analysis as number;
          const refinement = updated.refinement as number;
          const totalScore = clarity + leverage + experimentation + analysis + refinement;

          onComplete({
            orgSize: updated.orgSize as string,
            role: updated.role as string,
            challenge: updated.challenge as string,
            clarity,
            leverage,
            experimentation,
            analysis,
            refinement,
            totalScore,
          });
        }
      }, 300);
    },
    [answers, currentStep, totalSteps, onComplete]
  );

  const goBack = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((s) => s - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground/60">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-foreground/60">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div
        className={`transition-all duration-300 ${
          isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-8 leading-snug">
          {current.question}
        </h3>

        {/* Qualifying question: card grid */}
        {current.type === "qualifying" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((option) => {
              const isSelected = answers[current.key] === option;
              return (
                <button
                  key={option}
                  onClick={() => advance(current.key, option)}
                  className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-white/50 hover:border-primary/40 hover:bg-primary/5 text-foreground/80"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Scale question: 1-5 buttons */}
        {current.type === "scale" && (
          <div>
            <div className="flex justify-between gap-2 sm:gap-3 mb-3">
              {[1, 2, 3, 4, 5].map((n) => {
                const isSelected = answers[current.key] === n;
                return (
                  <button
                    key={n}
                    onClick={() => advance(current.key, n)}
                    className={`flex-1 aspect-square max-w-[72px] rounded-xl border-2 text-lg sm:text-xl font-bold transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border bg-white/50 hover:border-primary/40 hover:bg-primary/5 text-foreground/70"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-foreground/50">
              <span>{current.lowLabel}</span>
              <span>{current.highLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button
          onClick={goBack}
          className="mt-8 inline-flex items-center text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      )}
    </div>
  );
};

export default AssessmentQuiz;
