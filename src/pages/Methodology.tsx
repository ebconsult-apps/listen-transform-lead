
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Network,
  FlaskConical,
  LineChart,
  RefreshCw,
  BookOpen,
  Brain,
  Users,
  Building2,
  Layers,
  GitCompareArrows,
  CheckCircle,
  Compass,
  Repeat,
} from "lucide-react";

const Methodology = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.style.opacity = "1";
        heroRef.current.classList.add("animate-fade-in");
      }
    }, 100);

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        setTimeout(() => {
          section.style.opacity = "1";
          section.classList.add("animate-fade-in-up");
        }, 300 + index * 150);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="section-container">
          <div ref={heroRef} style={{ opacity: "0" }}>
            <div className="tag mb-4">Methodology</div>
            <h1 className="heading-xl mb-6">
              The CLEAR Change Framework
            </h1>
            <p className="body-lg max-w-3xl">
              A five-step, iterative approach to organizational change that
              combines behavioral science, systems thinking, and design thinking
              into a rigorous methodology for sustainable transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24">
        <div className="section-container max-w-4xl mx-auto">
          {/* Introduction */}
          <section
            ref={(el) => (sectionRefs.current[0] = el)}
            className="glass-card p-8 md:p-10 mb-10"
            style={{ opacity: "0" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">What Is the CLEAR Change Framework?</h2>
            </div>
            <p className="body-md mb-4">
              The CLEAR Change Framework is a structured, evidence-based methodology
              for leading organizational change. Created by Erik Bohjort, Licensed
              Psychologist and organizational consultant, CLEAR stands for Clarity,
              Leverage, Experimentation, Analysis, and Refinement. Each step
              represents a distinct phase in a continuous cycle of purposeful
              transformation.
            </p>
            <p className="body-md mb-4">
              Unlike linear change models that prescribe a fixed sequence from start
              to finish, CLEAR is designed to be iterative. Organizations revisit and
              deepen their understanding with each cycle, building cumulative insight
              and momentum. The framework draws on three complementary intellectual
              traditions: behavioral science provides the evidence base for how people
              and organizations actually change; systems thinking offers tools for
              understanding the interconnected dynamics within complex organizations;
              and design thinking contributes a bias toward rapid prototyping and
              learning through action.
            </p>
            <p className="body-md">
              At the heart of the CLEAR methodology is a commitment to listening.
              Genuine listening, both to stakeholders and to the system itself, is not
              a preliminary step but a continuous practice woven through every phase.
              By listening carefully, leaders uncover the real barriers to change,
              identify the most promising leverage points, and detect early signals of
              what is and is not working.
            </p>
          </section>

          {/* Theoretical Foundations */}
          <section
            ref={(el) => (sectionRefs.current[1] = el)}
            className="glass-card p-8 md:p-10 mb-10"
            style={{ opacity: "0" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">Theoretical Foundations</h2>
            </div>

            <h3 className="text-xl font-bold mb-3 mt-6">
              Kurt Lewin's Unfreeze-Change-Refreeze Model
            </h3>
            <p className="body-md mb-4">
              The CLEAR framework builds explicitly on the foundational work of Kurt
              Lewin, whose Unfreeze-Change-Refreeze model remains one of the most
              enduring contributions to change management theory. Lewin observed that
              successful change requires first destabilizing existing patterns
              (Unfreeze), then introducing and navigating through new ways of working
              (Change), and finally solidifying the new state so it becomes the norm
              (Refreeze). CLEAR maps onto this structure: the Clarity and Leverage
              phases correspond to Lewin's Unfreeze stage, where the organization
              examines its current reality and builds readiness for change.
              Experimentation aligns with the Change phase, where new interventions
              are tested in practice. Analysis and Refinement correspond to the
              Refreeze stage, where successful changes are evaluated, consolidated,
              and embedded into the organization's ongoing operations.
            </p>

            <h3 className="text-xl font-bold mb-3 mt-8">
              Listening as the Critical Catalyst
            </h3>
            <p className="body-md mb-4">
              While many change frameworks mention stakeholder engagement, CLEAR
              positions listening as the catalytic process that makes every other step
              effective. Active listening, in this context, means far more than hearing
              what people say. It includes observing organizational patterns, reading
              systemic feedback, and interpreting the signals that the system produces
              in response to interventions. Without disciplined listening, leaders risk
              optimizing for the wrong objectives, targeting superficial leverage
              points, or scaling interventions that work on paper but fail in
              practice.
            </p>

            <h3 className="text-xl font-bold mb-3 mt-8">
              Systems Thinking Approach
            </h3>
            <p className="body-md mb-4">
              CLEAR treats organizations as interconnected systems rather than
              collections of independent departments or processes. This means that a
              change in one part of the organization will inevitably produce effects
              elsewhere, sometimes in unexpected ways. Systems thinking provides the
              analytical tools to map these interdependencies, identify feedback loops
              that maintain the status quo, and locate the specific points in the
              system where a well-designed intervention can produce disproportionate
              positive impact. This perspective is particularly important for
              preventing the common failure mode where a change initiative succeeds
              locally but creates new problems elsewhere in the organization.
            </p>

            <h3 className="text-xl font-bold mb-3 mt-8">
              Behavioral Science Foundations
            </h3>
            <p className="body-md">
              The framework is grounded in established behavioral science, including
              goal-setting theory, which demonstrates that specific and challenging
              objectives drive higher performance than vague aspirations; the research
              on psychological safety, which shows that people engage more openly with
              change when they feel safe to voice concerns and experiment without fear
              of blame; and insights from motivation science about the conditions under
              which people sustain new behaviors over time. These scientific
              foundations ensure that CLEAR's recommendations are not merely
              intuitive but are supported by decades of empirical research.
            </p>
          </section>

          {/* The Five Steps */}
          <section
            ref={(el) => (sectionRefs.current[2] = el)}
            style={{ opacity: "0" }}
          >
            <h2 className="heading-md text-center mb-10">
              The Five Steps of CLEAR in Detail
            </h2>

            {/* Step C */}
            <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-24 w-1 bg-primary"></div>
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="tag mb-2">Step 1 &middot; Unfreeze Phase</div>
                    <h3 className="text-2xl font-bold">C &mdash; Clarity of Objectives</h3>
                  </div>
                </div>
                <p className="body-md mb-4">
                  Every CLEAR cycle begins by establishing a clear, shared vision of
                  what success looks like and why the change matters. This is the
                  organization's "North Star," a concise statement that aligns
                  stakeholders around a common purpose and provides a reference point
                  for all subsequent decisions.
                </p>
                <p className="body-md mb-4">
                  In practice, the Clarity phase involves conducting stakeholder
                  alignment workshops where leaders and key contributors collaboratively
                  define the core purpose of the change initiative. The output of these
                  workshops is a set of measurable Objectives and Key Results (OKRs) that
                  translate the high-level vision into concrete, trackable outcomes.
                  These OKRs serve a dual purpose: they provide objective criteria for
                  evaluating progress later in the cycle, and they create accountability
                  by making success explicitly defined rather than implicitly assumed.
                </p>
                <p className="body-md mb-6">
                  The key questions this phase answers are: Why is this change necessary?
                  What does success look like in measurable terms? Who are the key
                  stakeholders, and are they genuinely aligned? Within Lewin's model,
                  Clarity corresponds to the beginning of the Unfreeze phase, where the
                  organization "warms" its existing patterns and creates readiness for
                  something new.
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Activities:</h4>
                  <ul className="space-y-3">
                    {[
                      "Facilitate stakeholder alignment workshops to define the shared vision",
                      "Translate vision into measurable OKRs (Objectives and Key Results)",
                      "Assess organizational readiness and identify potential resistance",
                      "Build a compelling case for change that answers \"why now?\"",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Step L */}
            <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-24 w-1 bg-primary"></div>
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="tag mb-2">Step 2 &middot; Unfreeze Phase</div>
                    <h3 className="text-2xl font-bold">
                      L &mdash; Leverage through Systems Mapping
                    </h3>
                  </div>
                </div>
                <p className="body-md mb-4">
                  With clear objectives established, the next step is to understand
                  the organizational system well enough to identify where
                  interventions will have the greatest impact. This is the Leverage
                  phase, where the team maps the system dynamics across functions,
                  departments, and levels of the organization.
                </p>
                <p className="body-md mb-4">
                  Systems mapping involves identifying the key relationships,
                  dependencies, and feedback loops that shape how the organization
                  currently operates. The goal is to find high-impact leverage points:
                  specific places in the system where a relatively small, well-targeted
                  change can produce outsized positive effects. This analysis often
                  reveals that the most obvious intervention points are not the most
                  effective ones, and that the real barriers to change are structural
                  or relational rather than individual.
                </p>
                <p className="body-md mb-6">
                  The Leverage phase also serves as a critical reality check. By
                  mapping the system explicitly, teams challenge their existing
                  assumptions about how the organization works and often discover
                  dynamics they were previously unaware of. Like Clarity, Leverage is
                  part of Lewin's Unfreeze phase, focused on deeply understanding what
                  needs to change before rushing into action.
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Activities:</h4>
                  <ul className="space-y-3">
                    {[
                      "Conduct cross-functional mapping sessions to visualize system dynamics",
                      "Identify key relationships, dependencies, and reinforcing feedback loops",
                      "Locate high-impact leverage points where small changes create maximum effect",
                      "Challenge existing assumptions about how the organizational system works",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Step E */}
            <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-24 w-1 bg-primary"></div>
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <FlaskConical className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="tag mb-2">Step 3 &middot; Change Phase</div>
                    <h3 className="text-2xl font-bold">
                      E &mdash; Experimentation through Prototyping
                    </h3>
                  </div>
                </div>
                <p className="body-md mb-4">
                  The Experimentation phase marks the transition into Lewin's Change
                  stage. Rather than rolling out large-scale changes based on
                  theoretical analysis alone, CLEAR advocates for designing low-cost,
                  low-risk experiments that target the leverage points identified in
                  the previous phase. This approach dramatically reduces the risk of
                  large-scale failure while generating real-world data about what
                  actually works.
                </p>
                <p className="body-md mb-4">
                  In practice, this means designing rapid prototypes and pilot
                  projects that can be implemented quickly and evaluated against clear
                  criteria. The experiments are deliberately bounded in scope so that
                  failure is informative rather than catastrophic. Each experiment is
                  an opportunity to test both the proposed intervention and the
                  team's understanding of the system itself.
                </p>
                <p className="body-md mb-6">
                  Listening is especially critical during experimentation. The team
                  must pay careful attention to how the system responds to
                  interventions, including unintended side effects, unexpected
                  resistance, and emergent opportunities that were not anticipated in
                  the planning phase. This feedback from the system is the raw
                  material for the next phase.
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Activities:</h4>
                  <ul className="space-y-3">
                    {[
                      "Design low-cost, low-risk experiments targeting identified leverage points",
                      "Run rapid prototypes and bounded pilot projects",
                      "Gather immediate data and qualitative feedback from participants",
                      "Listen carefully to system responses, including unintended effects",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Step A */}
            <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-24 w-1 bg-primary"></div>
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="tag mb-2">Step 4 &middot; Refreeze Phase</div>
                    <h3 className="text-2xl font-bold">
                      A &mdash; Analysis and Reflection
                    </h3>
                  </div>
                </div>
                <p className="body-md mb-4">
                  The Analysis phase brings disciplined evaluation to the
                  experimentation results. This is where the team rigorously assesses
                  what happened against the predefined key results established in the
                  Clarity phase. The goal is not simply to determine whether an
                  experiment "worked" or "failed," but to extract maximum learning from
                  every intervention.
                </p>
                <p className="body-md mb-4">
                  Structured review meetings and reflective discussions form the
                  backbone of this phase. Teams examine what worked as expected, what
                  did not, and, crucially, what surprised them. Surprises are
                  particularly valuable because they reveal gaps in the team's
                  understanding of the system. The systems map created during the
                  Leverage phase is updated with these new insights, creating an
                  increasingly accurate picture of organizational dynamics.
                </p>
                <p className="body-md mb-6">
                  The output of Analysis is a set of actionable conclusions: specific
                  recommendations about which interventions to scale, which to modify,
                  and which to abandon. This evidence-based approach prevents the
                  common organizational tendency to either double down on failing
                  initiatives out of sunk-cost bias or to abandon promising approaches
                  prematurely.
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Activities:</h4>
                  <ul className="space-y-3">
                    {[
                      "Evaluate experiment outcomes rigorously against predefined key results",
                      "Conduct structured review meetings and reflective discussions",
                      "Identify what worked, what failed, and what produced unexpected results",
                      "Update the systems map with new understanding and draw actionable conclusions",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Step R */}
            <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-24 w-1 bg-primary"></div>
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="tag mb-2">Step 5 &middot; Refreeze Phase</div>
                    <h3 className="text-2xl font-bold">
                      R &mdash; Refinement and Scaling
                    </h3>
                  </div>
                </div>
                <p className="body-md mb-4">
                  The Refinement phase closes the loop. Learnings from Analysis are
                  fed back into the process: the vision and objectives may be
                  sharpened based on what the organization has discovered, the systems
                  understanding is updated with new data, and the experimentation
                  process itself is improved based on what the team learned about how
                  to run effective pilots.
                </p>
                <p className="body-md mb-4">
                  For interventions that proved successful, this phase focuses on
                  scaling them across the organization in a way that is sustainable and
                  context-sensitive. Scaling is not merely replication; it requires
                  adapting the intervention to different parts of the organization
                  while preserving the core principles that made it effective.
                </p>
                <p className="body-md mb-6">
                  Within Lewin's model, Refinement corresponds to the Refreeze stage,
                  where new patterns are embedded and stabilized. However, because
                  CLEAR is cyclical, Refinement also serves as the natural bridge to
                  the next cycle. The clarified objectives and deepened systems
                  understanding become the starting point for renewed Clarity, and the
                  organization continues to evolve with each iteration.
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium mb-4">Key Activities:</h4>
                  <ul className="space-y-3">
                    {[
                      "Feed learnings back into clarified vision and updated objectives",
                      "Refine the systems map and experimentation process based on new data",
                      "Scale successful interventions across the organization with contextual adaptation",
                      "Embed changes sustainably or begin the next CLEAR cycle with renewed clarity",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Iterative Nature */}
          <section
            ref={(el) => (sectionRefs.current[3] = el)}
            className="glass-card p-8 md:p-10 mb-10"
            style={{ opacity: "0" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Repeat className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">The Iterative Nature of CLEAR</h2>
            </div>
            <p className="body-md mb-4">
              A defining characteristic of the CLEAR framework is that it is
              cyclical, not linear. While many change methodologies present a
              sequence of stages that an organization passes through once, CLEAR is
              designed to be repeated. Each cycle deepens the organization's
              understanding of its own dynamics, builds on the learning from previous
              cycles, and increases the precision of future interventions.
            </p>
            <p className="body-md mb-4">
              The connection between Refinement and Clarity is particularly
              important. As the organization refines its interventions and scales
              what works, the new organizational state naturally raises new questions:
              Has the original vision been achieved? Has the context shifted? Are
              there new leverage points that were invisible before? These questions
              feed directly into a renewed Clarity phase, making the transition from
              one cycle to the next organic rather than forced.
            </p>
            <p className="body-md">
              This iterative design means that CLEAR is equally applicable to short,
              focused improvement sprints and to long-term, multi-year transformation
              programs. The cadence and scope of each cycle can be adjusted to fit the
              organization's needs and capacity for change.
            </p>
          </section>

          {/* Comparisons */}
          <section
            ref={(el) => (sectionRefs.current[4] = el)}
            className="glass-card p-8 md:p-10 mb-10"
            style={{ opacity: "0" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <GitCompareArrows className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">
                How CLEAR Compares to Other Frameworks
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">
                  CLEAR vs. Kotter's 8-Step Model
                </h3>
                <p className="body-md">
                  Kotter's model provides a linear, eight-stage roadmap for change.
                  CLEAR shares the emphasis on creating urgency and building coalitions
                  but differs fundamentally in its iterative structure and its
                  integration of systems thinking. Where Kotter prescribes a fixed
                  sequence, CLEAR allows organizations to cycle through the steps
                  multiple times, deepening their understanding with each pass.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">CLEAR vs. ADKAR</h3>
                <p className="body-md">
                  ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement) focuses
                  on individual behavior change. CLEAR operates at the organizational
                  system level, addressing not just individual readiness but the
                  structural dynamics, feedback loops, and leverage points that
                  determine whether individual change efforts succeed or are undermined
                  by the system.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">
                  CLEAR vs. Lean Change Management
                </h3>
                <p className="body-md">
                  Lean Change Management shares CLEAR's iterative spirit and emphasis
                  on experimentation. CLEAR extends this approach by adding systematic
                  leverage analysis through systems mapping and grounding the
                  methodology in behavioral science foundations, providing a more
                  complete toolkit for understanding why certain interventions succeed
                  or fail.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">
                  CLEAR vs. Design Thinking
                </h3>
                <p className="body-md">
                  Design thinking's emphasis on empathy, prototyping, and iteration is
                  a significant influence on CLEAR. However, design thinking was
                  originally developed for product and service innovation. CLEAR
                  extends these principles to full organizational change, adding
                  systems mapping and behavioral science foundations that are essential
                  when the "product" being redesigned is an entire organization.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">
                  CLEAR vs. OBM (Organizational Behavior Management)
                </h3>
                <p className="body-md">
                  OBM applies behavioral analysis principles to organizational
                  performance. CLEAR incorporates behavioral science but adds systems
                  mapping to understand organizational dynamics at a structural level
                  and purpose-driven clarity to ensure interventions are aligned with
                  strategic objectives rather than optimizing individual behaviors in
                  isolation.
                </p>
              </div>
            </div>
          </section>

          {/* Who CLEAR Is For */}
          <section
            ref={(el) => (sectionRefs.current[5] = el)}
            className="glass-card p-8 md:p-10 mb-10"
            style={{ opacity: "0" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="heading-md">Who CLEAR Is For</h2>
            </div>
            <p className="body-md mb-6">
              The CLEAR Change Framework is designed for organizations and leaders
              facing complex, multi-dimensional change challenges where simple
              prescriptions are insufficient and where the stakes of getting the
              change wrong are significant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  Organizations
                </h3>
                <ul className="space-y-2">
                  {[
                    "Navigating culture change, operational transformation, or strategic pivots",
                    "Managing mergers, acquisitions, or restructurings",
                    "Implementing digital transformation or new technology adoption",
                    "Building more adaptive, learning-oriented organizational cultures",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-foreground/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Leaders and Teams
                </h3>
                <ul className="space-y-2">
                  {[
                    "Seeking an evidence-based approach to transformation",
                    "Needing to move from insight to action systematically",
                    "Wanting to build internal change capability, not just hire consultants",
                    "Looking for a repeatable process that improves over time",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-foreground/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-muted/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Industries
              </h3>
              <p className="body-md">
                CLEAR has been applied across a wide range of sectors, including
                technology, manufacturing, healthcare, financial services, government
                agencies, and organizations focused on sustainability. The
                framework's adaptability means it can be calibrated to the specific
                regulatory, cultural, and operational constraints of any industry.
              </p>
            </div>
          </section>

          {/* Getting Started CTA */}
          <section
            ref={(el) => (sectionRefs.current[6] = el)}
            className="glass-card p-8 md:p-10 text-center"
            style={{ opacity: "0" }}
          >
            <h2 className="heading-md mb-6">Getting Started with CLEAR</h2>
            <p className="body-md mb-4 max-w-2xl mx-auto">
              Whether you are beginning a new transformation initiative or looking to
              bring more rigor and structure to an ongoing change effort, the CLEAR
              framework provides a proven methodology for moving from analysis to
              action and from action to sustained results.
            </p>
            <p className="body-md mb-8 max-w-2xl mx-auto">
              The first step is a consultation to understand your organization's
              specific context, challenges, and objectives. From there, we design a
              tailored application of CLEAR that fits your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Book a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/services" className="btn-secondary">
                View Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default Methodology;
