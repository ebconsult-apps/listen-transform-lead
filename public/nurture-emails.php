<?php
function get_email_template($templateName, $vars = []) {
    $name = $vars['name'] ?? 'there';
    $firstName = explode(' ', $name)[0];
    $bookingUrl = 'https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink';

    $footer = "<p style='color: #718096; font-size: 14px; margin-top: 40px;'>Erik Bohjort<br>Licensed Psychologist & Founder, EB Consulting<br><a href='https://clear-framework.com' style='color: #2563eb;'>clear-framework.com</a></p>";
    $btnStyle = "background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;";
    $pStyle = "color: #4a5568; line-height: 1.7; font-size: 16px;";
    $wrap = function($body) { return "<div style='font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;'>{$body}</div>"; };

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
            'subject' => 'Your Change Readiness Results',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Thank you for taking the Change Readiness Assessment. Your results highlight where your organization's strengths and opportunities lie across the five CLEAR dimensions.</p>
                <p style='{$pStyle}'>Assessment scores are a starting point — the real insights come from exploring what's behind the numbers. If you'd like to discuss what your results mean for your specific situation, I'd be happy to talk it through.</p>
                <p style='margin-top: 30px;'><a href='{$bookingUrl}' style='{$btnStyle}'>Discuss Your Results — Free Call</a></p>
                {$footer}"
            ),
        ],

        'chapter_welcome' => [
            'subject' => 'Your free chapter of The CLEAR Change Framework',
            'html' => $wrap(
                "<h1 style='color: #1e3a5f; font-size: 24px;'>Hi {$firstName},</h1>
                <p style='{$pStyle}'>Thank you for your interest in the book. We'll send you a free chapter soon — keep an eye on your inbox.</p>
                <p style='{$pStyle}'>In the meantime, you might find the Change Readiness Assessment useful — it takes 2 minutes and gives you a quick read on where your organization stands.</p>
                <p style='margin-top: 30px;'><a href='https://clear-framework.com/assessment' style='{$btnStyle}'>Take the Assessment</a></p>
                {$footer}"
            ),
        ],
    ];

    return $templates[$templateName] ?? null;
}
?>
