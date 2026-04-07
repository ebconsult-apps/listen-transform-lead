# CLEAR Framework Site Refactor - Implementation Plan

## Overview

Complete refactor of clear-framework.com covering rebranding, performance, bugs, self-assessment tool, and SEO subpages. 7 parallelizable streams.

---

## Stream 1: Bug Fixes (CRITICAL, Small)

### 1A. TrustedBy opacity bug
**File:** src/components/TrustedBy.tsx line 36

opacity-0 class is set but the IntersectionObserver callback only adds animate-fade-in without first setting style.opacity to 1. Every other component uses the two-step pattern. Fix: cast entry.target to HTMLElement, set style.opacity to 1, then add animate-fade-in class.

### 1B. Portrait image quality
**File:** public/erik-portrait.jpg (12KB, ~474x474px)

Rendered at aspect-[4/5] in AboutPreview.tsx and aspect-[3/4] in About.tsx. Containers exceed 500px on large screens. Replace with 1200x1500px JPEG or constrain max-w-[474px].

---

## Stream 2: SLF-to-CLEAR Rebranding (HIGH, Medium)

Change all brand references. Keep book title as-is.

**Layout.tsx:** Lines 41-43 logo SLF to CLEAR, 96-98 footer logo, 100-102 footer desc, 134 copyright.
**CTASection.tsx:** Line 50 and 61 SLF references.
**About.tsx:** Line 81 and 97-99 SLF references.
**FrameworkPreview.tsx:** Line 105 heading, 108 SLF text.
**GetTheBook.tsx:** Line 330 checkbox label.
Leave BookPreview/FreeChapterForm/GetTheBook book title references as-is.

---

## Stream 3: Performance Fixes (HIGH, Medium)

### 3A. Remove backdrop-blur
**File:** src/index.css
- .glass (line 67): Remove backdrop-blur-lg. Use bg-white/80 border border-white/60 shadow-sm.
- .glass-card (line 71): Remove backdrop-blur-xl. Use bg-white/90 border border-white/70 shadow-lg rounded-2xl.
- Layout.tsx line 31 header: keep but reduce to backdrop-blur-sm.

### 3B. Remove rotating orbs
**File:** src/components/Hero.tsx lines 106-107. Delete both animate-rotate-slow divs.

### 3C. Faster animations
**File:** tailwind.config.ts lines 109-113. Change 0.6s to 0.3s.

### 3D. Hero height
**File:** src/components/Hero.tsx line 49. min-h-[90vh] to min-h-[60vh].

---

## Stream 4: Booking CTA (HIGH, Small)

### 4A. Hero CTA swap
**File:** src/components/Hero.tsx lines 95-101. Book Consultation becomes btn-primary, Explore Model becomes btn-secondary.

### 4B. Hero copy update
Line 71: First Listen tag to CLEAR Change Framework. Line 78: new tagline. Lines 86-87: reference CLEAR.

---

## Stream 5: Self-Assessment Tool (HIGH, LARGE)

### New files to create:
- src/pages/Assessment.tsx (entry page with SEO)
- src/components/assessment/AssessmentWizard.tsx (state machine)
- src/components/assessment/QuestionCard.tsx (single question UI)
- src/components/assessment/ProgressBar.tsx (visual progress)
- src/components/assessment/ResultsPage.tsx (radar chart + recommendations)
- src/components/assessment/EmailGate.tsx (email capture)
- src/data/assessment-questions.ts (questions + types)
- src/utils/assessment-scoring.ts (scoring logic)
- public/assessment-handler.php (backend)

### Data Model
AssessmentQuestion: id, dimension, text, subtext, type (scale/single-choice), options, scaleLabels.
AssessmentState: currentStep, answers, scores, qualifying, email, name.
DimensionScores: clarity, leverage, experimentation, analysis, refinement, overall.

### 10 Questions
Qualifying (3): org size, industry, role.
CLEAR (7, Likert 1-5): clarity objectives, leadership alignment, system dynamics, testing comfort, feedback speed, measurement, learnings incorporation.

### State Machine
intro > qualifying(3) > assessment(7) > results-preview > email-gate > results-full.
Single question per screen, progress bar, back button, 0.3s fades, all client-side.

### Results
Recharts radar chart, overall percentage, color bars, personalized recommendations per dimension.
Score < 3: improvement recommendation. Overall > 3.5: urgent booking CTA. Overall < 2.5: empathetic messaging.

### Email Gate
Radar + overall visible free. Detailed analysis behind Name/Email/Company form. POST to assessment-handler.php.

### Backend
Mirrors lead-handler.php: JSON POST, saves CSV, sends email notification.

### Registration
App.tsx: assessment route. vite.config.ts: /assessment. sitemap.xml: priority 0.9. main.yml: exclude PHP + CSV.

---

## Stream 6: Niche SEO Subpages (MEDIUM, Medium)

### New files:
- src/pages/NichePage.tsx (dynamic route handler)
- src/components/NichePageTemplate.tsx (reusable template)
- src/data/niche-pages.ts (content data for 7 pages)

### Template
Inside Layout (nav/footer). Sections: SEO hero, problem statement, CLEAR application, case study, services, booking CTA.

### 7 Pages:
/consulting/change-management-stockholm, /consulting/change-management-europe, /consulting/organizational-psychology-consulting, /consulting/manufacturing-change-management, /consulting/healthcare-change-management, /consulting/sustainability-change-management, /consulting/merger-integration-consulting.

### Registration
App.tsx: consulting/:slug. vite.config.ts: all 7 routes. sitemap.xml: priority 0.7.

---

## Stream 7: SLF to Resources (MEDIUM, Small)

1. FrameworkPreview.tsx: Reframe as Structured Listening Method.
2. Layout.tsx nav: Rename Methodology to reflect CLEAR.
3. Resources.tsx: Add SLF book card alongside whitepapers.
4. BookPreview.tsx: Frame book as part of CLEAR toolkit.

---

## Implementation Phases

Phase 1 (parallel, ~30m): Streams 1A, 1B, 3D, 4A.
Phase 2 (parallel, ~1h): Streams 2, 3A-C, 4B, 7.
Phase 3 (parallel, ~4-5h): Streams 5, 6.
Phase 4: Integration and testing.

## Dependencies

Streams 1, 2, 3: no dependencies.
Streams 4, 5, 6, 7: after Stream 2.

Parallel agents: A(1+3), B(2), C(5), D(6), then E(4+7).

---

## Critical Files for Implementation

### MODIFY:
1. src/components/TrustedBy.tsx
2. src/components/Hero.tsx
3. src/components/CTASection.tsx
4. src/components/Layout.tsx
5. src/components/FrameworkPreview.tsx
6. src/pages/About.tsx
7. src/pages/GetTheBook.tsx
8. src/index.css
9. tailwind.config.ts
10. src/App.tsx
11. vite.config.ts
12. public/sitemap.xml
13. .github/workflows/main.yml

### CREATE:
14. src/pages/Assessment.tsx
15. src/components/assessment/AssessmentWizard.tsx
16. src/components/assessment/QuestionCard.tsx
17. src/components/assessment/ProgressBar.tsx
18. src/components/assessment/ResultsPage.tsx
19. src/components/assessment/EmailGate.tsx
20. src/data/assessment-questions.ts
21. src/utils/assessment-scoring.ts
22. public/assessment-handler.php
23. src/pages/NichePage.tsx
24. src/components/NichePageTemplate.tsx
25. src/data/niche-pages.ts

### REPLACE:
26. public/erik-portrait.jpg
