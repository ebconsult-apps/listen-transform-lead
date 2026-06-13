<?php
function get_email_template($templateName, $vars = []) {
    $name = $vars['name'] ?? 'there';
    $firstName = explode(' ', $name)[0];
    $bookingUrl = 'https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink';

    $footer = "<p style='color: #718096; font-size: 14px; margin-top: 40px;'>Erik Bohjort<br>Licensed Psychologist & Founder, EB Consulting<br><a href='https://clear-framework.com' style='color: #2563eb;'>clear-framework.com</a></p>";
    $btnStyle = "background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;";
    $pStyle = "color: #4a5568; line-height: 1.7; font-size: 16px;";
    $wrap = function($body) { return "<div style='font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;'>{$body}</div>"; };

    // Builds the full personalized Change Readiness Report email body.
    // Dimension copy mirrors src/components/AssessmentResults.tsx so the email
    // and the on-screen results stay consistent. Falls back to a simple note
    // if no scores were passed (backward compatible).
    $buildAssessmentReport = function($vars) use ($pStyle, $btnStyle, $footer, $bookingUrl, $wrap) {
        $name = $vars['name'] ?? 'there';
        $firstName = explode(' ', $name)[0];

        if (!isset($vars['totalScore'])) {
            return $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Thank you for taking the Change Readiness Assessment. Your results highlight where your organization's strengths and opportunities lie across the five CLEAR dimensions.</p>
                <p style='{$pStyle}'>Assessment scores are a starting point — the real insights come from exploring what's behind the numbers. If you'd like to discuss what your results mean for your specific situation, I'd be happy to talk it through.</p>
                <p style='margin-top: 30px;'><a href='{$bookingUrl}' style='{$btnStyle}'>Discuss Your Results — Free Call</a></p>
                {$footer}"
            );
        }

        $total = (int)$vars['totalScore'];
        $challenge = trim($vars['challenge'] ?? '');
        $role = trim($vars['role'] ?? '');

        // Readiness tier — same thresholds as assessment-handler.php
        if ($total <= 12) {
            $tier = 'Significant Opportunity';
            $tierBlurb = "Your organization has considerable room to strengthen how it leads change. A structured approach like CLEAR can help build the foundations.";
        } elseif ($total <= 18) {
            $tier = 'Building Momentum';
            $tierBlurb = "You have real building blocks in place, with clear gaps to close. Targeted work in your weaker dimensions can unlock meaningful progress.";
        } else {
            $tier = 'Strong Foundation';
            $tierBlurb = "Your organization shows strong change readiness. Fine-tuning the details can help you reach the next level.";
        }

        // How the recipient's role shapes their part in the work
        $roleFraming = [
            'C-Suite / Executive' => 'set the strategic frame and model the change you want to see',
            'VP / Director' => 'translate strategy into program design and clear blockers for your teams',
            'Manager / Team Lead' => 'operationalize the change day-to-day with your team',
            'Consultant / Advisor' => 'guide your client through each dimension with the evidence behind you',
        ];
        $roleAction = $roleFraming[$role] ?? 'move this work forward in your organization';
        $challengePhrase = $challenge !== '' ? " focused on <strong>{$challenge}</strong>" : '';
        $rolePhrase = $role !== '' ? "As a {$role}{$challengePhrase}, your leverage is to {$roleAction}." : '';

        // Per-dimension content (mirrors dimensionMeta in AssessmentResults.tsx)
        $dims = [
            'clarity' => [
                'label' => 'Clarity',
                'emerging' => "Objectives aren't clearly defined or shared — stakeholders are likely pulling toward different definitions of success.",
                'developing' => "There's a working sense of direction, but it isn't yet consistently shared across teams.",
                'strong' => "Objectives are well-defined and widely understood — a strong base for aligned action.",
                'rec' => "Run structured goal-setting workshops with cross-functional teams and use OKRs to translate vision into measurable targets everyone can rally behind.",
                'strength' => "Protect this. Keep objectives visible and revisit them as conditions change so alignment doesn't quietly erode.",
                'step' => "tighten and re-share your change objectives so every team works from the same definition of success",
            ],
            'leverage' => [
                'label' => 'Leverage',
                'emerging' => "System dynamics and leverage points are largely unmapped, so effort tends to land on symptoms rather than causes.",
                'developing' => "You see some of the system, but the highest-impact leverage points aren't yet explicit.",
                'strong' => "You understand where small, well-placed changes create outsized impact.",
                'rec' => "Invest in systems-mapping sessions to visualize interconnections and identify the few leverage points where small changes produce the greatest systemic impact.",
                'strength' => "Keep mapping as the system evolves — today's leverage point isn't always tomorrow's.",
                'step' => "run a systems-mapping session to locate the few leverage points worth concentrating effort on",
            ],
            'experimentation' => [
                'label' => 'Experimentation',
                'emerging' => "Change tends to be all-or-nothing, which makes every initiative high-stakes and slow to course-correct.",
                'developing' => "You pilot occasionally, but experimentation isn't yet a reliable default.",
                'strong' => "Safe-to-fail experimentation is part of how you operate.",
                'rec' => "Build a culture of safe-to-fail experiments — start with low-risk pilots and a simple framework for rapid prototyping before large-scale rollouts.",
                'strength' => "Keep lowering the cost of a good experiment so the habit compounds.",
                'step' => "run your next change as a small, time-boxed pilot before committing fully",
            ],
            'analysis' => [
                'label' => 'Analysis',
                'emerging' => "Outcomes are rarely measured or reflected on, so the organization repeats what it can't see.",
                'developing' => "You measure some outcomes, but reflection isn't yet systematic.",
                'strong' => "You measure outcomes and reflect on them rigorously.",
                'rec' => "Establish regular reflection cycles with structured reviews after every initiative, plus dashboards that capture insights systematically rather than anecdotally.",
                'strength' => "Keep the feedback loops short so insight arrives while it can still change the decision.",
                'step' => "add a short structured review after your next initiative to capture what worked and what didn't",
            ],
            'refinement' => [
                'label' => 'Refinement',
                'emerging' => "Learnings get lost rather than fed back into how the organization plans and acts.",
                'developing' => "Some learnings stick, but they aren't yet reliably built into the next cycle.",
                'strong' => "Learning compounds — insight flows back into planning and successful experiments get scaled.",
                'rec' => "Create formal learning loops that connect insights from analysis back into planning, with clear criteria for scaling what works and building institutional memory.",
                'strength' => "Keep documenting and scaling so individual learning becomes organizational capability.",
                'step' => "build one recent insight explicitly into your next planning cycle",
            ],
        ];

        $scores = [];
        foreach ($dims as $key => $d) {
            $scores[$key] = (int)($vars[$key] ?? 0);
        }

        // Per-dimension blocks
        $blocks = '';
        foreach ($dims as $key => $d) {
            $s = $scores[$key];
            if ($s <= 2) {
                $word = 'Emerging'; $interp = $d['emerging']; $color = '#dc2626';
                $bench = "Below the 3/5 most organizations score here — a priority area.";
            } elseif ($s == 3) {
                $word = 'Developing'; $interp = $d['developing']; $color = '#d97706';
                $bench = "About average — most organizations score around 3/5 here.";
            } else {
                $word = 'Strong'; $interp = $d['strong']; $color = '#16a34a';
                $bench = "Above the 3/5 most organizations score here — a relative strength.";
            }
            $advice = $s >= 4 ? $d['strength'] : $d['rec'];
            $blocks .= "<tr><td style='padding: 16px 0; border-top: 1px solid #e2e8f0;'>
                <div>
                  <strong style='color: #1e3a5f; font-size: 16px;'>{$d['label']}</strong>
                  <span style='float: right; font-weight: 700; color: {$color};'>{$s}/5 &middot; {$word}</span>
                </div>
                <p style='color: #4a5568; line-height: 1.6; font-size: 14px; margin: 10px 0 0;'>{$interp}</p>
                <p style='color: #718096; font-size: 13px; margin: 6px 0 0;'><em>Benchmark: {$bench}</em></p>
                <p style='color: #1e3a5f; line-height: 1.6; font-size: 14px; margin: 8px 0 0;'><strong>Recommended:</strong> {$advice}</p>
              </td></tr>";
        }

        // Two lowest dimensions (stable tie-break by CLEAR order) for the action plan
        $ordered = [];
        $i = 0;
        foreach ($scores as $key => $s) {
            $ordered[] = ['key' => $key, 'score' => $s, 'order' => $i++];
        }
        usort($ordered, function($a, $b) {
            return ($a['score'] <=> $b['score']) ?: ($a['order'] <=> $b['order']);
        });
        $low1 = $dims[$ordered[0]['key']];
        $low2 = $dims[$ordered[1]['key']];
        $challengeStep = $challenge !== ''
            ? "Map these gains to your stated priority — <strong>{$challenge}</strong> — by turning this snapshot into a concrete roadmap on a short call."
            : "Turn this snapshot into a concrete roadmap on a short call.";
        $steps = "<ol style='color: #4a5568; line-height: 1.7; font-size: 15px; padding-left: 20px; margin: 0;'>
            <li style='margin-bottom: 10px;'><strong>{$low1['label']} first.</strong> Over the next few weeks, {$low1['step']}.</li>
            <li style='margin-bottom: 10px;'><strong>Then {$low2['label']}.</strong> Next, {$low2['step']}.</li>
            <li>{$challengeStep}</li>
        </ol>";

        return $wrap(
            "<h1 style='color: #1e3a5f; font-size: 24px; margin-bottom: 8px;'>Hi {$firstName}, here's your readiness report</h1>

            <div style='background: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin: 20px 0;'>
                <div style='font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;'>Overall Readiness</div>
                <div style='font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 4px 0;'>{$total}<span style='font-size: 18px; font-weight: 400; color: #94a3b8;'>/25</span> &middot; {$tier}</div>
                <p style='color: #4a5568; line-height: 1.6; font-size: 15px; margin: 8px 0 0;'>{$tierBlurb}</p>
                <p style='color: #718096; font-size: 13px; margin: 8px 0 0;'><em>For context, the typical organization we assess scores between 13 and 18 out of 25.</em></p>
            </div>

            " . ($rolePhrase !== '' ? "<p style='{$pStyle}'>{$rolePhrase}</p>" : "") . "

            <h2 style='color: #1e3a5f; font-size: 18px; margin: 28px 0 4px;'>Your five CLEAR dimensions</h2>
            <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse;'>{$blocks}</table>

            <h2 style='color: #1e3a5f; font-size: 18px; margin: 28px 0 12px;'>Your prioritized next steps</h2>
            {$steps}

            <p style='margin-top: 30px;'><a href='{$bookingUrl}' style='{$btnStyle}'>Discuss Your Results — Free Call</a></p>
            {$footer}"
        );
    };

    $templates = [
        'whitepaper_welcome' => [
            'subject' => 'Your CLEAR Framework resource is ready',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Thank you for downloading the whitepaper. Your resource is ready at the link you received on the site.</p>
                <p style='{$pStyle}'>The CLEAR Change Framework was developed from years of working with organizations facing complex transformation challenges. If you have questions about applying these ideas to your situation, I'm happy to chat.</p>
                <p style='margin-top: 30px;'><a href='{$bookingUrl}' style='{$btnStyle}'>Book a Free Discovery Call</a></p>
                {$footer}"
            ),
        ],

        'nurture_day3' => [
            'subject' => 'The #1 reason change initiatives fail',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Over 70% of change initiatives fail. The most common reason? <strong>Lack of clarity.</strong></p>
                <p style='{$pStyle}'>Organizations rush into action without a shared understanding of what success looks like. Different stakeholders carry different mental models, and the misalignment only surfaces when it's expensive to fix.</p>
                <p style='{$pStyle}'>A simple diagnostic: <em>If you asked five people in your leadership team what success looks like for your current initiative, would they give the same answer?</em></p>
                <p style='{$pStyle}'>If the answer is no, that's where we start.</p>
                <p style='margin-top: 30px;'><a href='https://clear-framework.com/methodology' style='{$btnStyle}'>Read About the CLEAR Methodology</a></p>
                {$footer}"
            ),
        ],

        'nurture_day7' => [
            'subject' => 'Finding leverage where no one is looking',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>A manufacturing company came to us with operational downtime eating into profitability. Previous fixes focused on technology and procedures — but the real issue was systemic.</p>
                <p style='{$pStyle}'>Using systems mapping, we found the leverage point wasn't in equipment or processes — it was in the handoff communication between shifts. A small experiment with a new protocol, tested on one line, showed immediate results.</p>
                <p style='{$pStyle}'><strong>The insight:</strong> most organizations optimize the obvious. Systems mapping finds the non-obvious.</p>
                <p style='{$pStyle}'>Curious where your leverage points are?</p>
                <p style='margin-top: 30px;'><a href='https://clear-framework.com/assessment' style='{$btnStyle}'>Take the Change Readiness Assessment</a></p>
                {$footer}"
            ),
        ],

        'nurture_day14' => [
            'subject' => 'A quick question about your change initiative',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>I wanted to check in — you downloaded one of our CLEAR framework resources a couple of weeks ago, and I'm curious whether it resonated with any challenges you're currently facing.</p>
                <p style='{$pStyle}'>If you're dealing with a change initiative that feels stuck, or planning something significant and want to think it through — I'd welcome the conversation.</p>
                <p style='{$pStyle}'>I set aside a few 30-minute slots each week for exactly this kind of exploratory discussion. No obligation, no pitch — just a genuine conversation about your situation.</p>
                <p style='margin-top: 30px;'><a href='{$bookingUrl}' style='{$btnStyle}'>Book a Discovery Call</a></p>
                {$footer}"
            ),
        ],

        'assessment_welcome' => [
            'subject' => 'Your Change Readiness Report',
            'html' => $buildAssessmentReport($vars),
        ],

        'chapter_welcome' => [
            'subject' => 'Your free chapter of The CLEAR Change Framework',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Thank you for your interest in the book. Your free chapter is ready — download it using the button below.</p>
                <p style='margin-top: 30px;'><a href='https://clear-framework.com/whitepapers/clear-change-framework.pdf' style='{$btnStyle}'>Download Your Chapter</a></p>
                <p style='{$pStyle}'>You might also find the Change Readiness Assessment useful — it takes 2 minutes and gives you a quick read on where your organization stands. <a href='https://clear-framework.com/assessment' style='color: #2563eb;'>Take the assessment</a>.</p>
                {$footer}"
            ),
        ],
    ];

    return $templates[$templateName] ?? null;
}
?>
