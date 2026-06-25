# Coverage

Every route and component group is accounted for below — no silent omissions. **Visual + code** = rendered in headless Chrome at desktop (1440) + mobile (390) and cross-checked against source. **Code-only / partial** = route needs auth or a token, so the screenshot shows a fallback and the real UI was audited from source.

## Routes (45)

| Route | Audit surface | Evidence |
|---|---|---|
| `/` | Home | visual + code |
| `/about` | About | visual + code |
| `/resources` | Resources | visual + code |
| `/services` | Services (hub) | visual + code |
| `/contact` | Contact | visual + code |
| `/get-the-book` | Get the Book | visual + code |
| `/framework` | Framework | visual + code |
| `/methodology` | Methodology | visual + code |
| `/faq` | FAQ | visual + code |
| `/booking-confirmed` | Booking Confirmed | visual + code |
| `/thank-you` | Thank You | visual + code |
| `/assessment` | Assessment quiz | visual + code |
| `/insights` | Insights | visual + code |
| `/services/change-management` | Service detail pages (family of 6) | visual + code |
| `/services/leadership-development` | Service detail pages (family of 6) | visual + code |
| `/services/executive-coaching` | Service detail pages (family of 6) | visual + code |
| `/services/psychometric-assessments` | Service detail pages (family of 6) | visual + code |
| `/services/workshops` | Service detail pages (family of 6) | visual + code |
| `/services/speaking` | Service detail pages (family of 6) | visual + code |
| `/consulting/change-management-stockholm` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/change-management-europe` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/organizational-psychology-consulting` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/manufacturing-change-management` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/healthcare-change-management` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/sustainability-change-management` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/consulting/merger-integration-consulting` | Consulting / niche SEO pages (family of 7) | visual + code |
| `/lp/organizational-change` | Standalone landing pages (family of 7) | visual + code |
| `/lp/clear-whitepaper` | Standalone landing pages (family of 7) | visual + code |
| `/lp/sustainability` | Standalone landing pages (family of 7) | visual + code |
| `/lp/change-management` | Standalone landing pages (family of 7) | visual + code |
| `/lp/leadership-development` | Standalone landing pages (family of 7) | visual + code |
| `/lp/organizational-psychology` | Standalone landing pages (family of 7) | visual + code |
| `/lp/merger-integration` | Standalone landing pages (family of 7) | visual + code |
| `/product` | Product landing | visual + code |
| `/product/sample` | Sample report | visual + code |
| `/pricing` | Pricing | visual + code |
| `/login` | Login | visual + code |
| `/signup` | Signup | visual + code |
| `/auth/callback` | Auth callback | partial — redirect/loading state only |
| `/app` | App — Dashboard | code-only — screenshot is the auth/config fallback (no session) |
| `/app/projects/new` | App — New Project | code-only — auth fallback |
| `/app/projects/:id` | App — Project workspace | code-only — auth fallback (dynamic :id) |
| `/account/billing` | Account — Billing | code-only — auth fallback |
| `/respond/:token` | Respondent portal | partial — dummy-token state + full source |
| `/* (404)` | 404 Not Found | visual + code |

_45 routes total. Service / consulting / landing pages were audited as template families — every page's screenshot was reviewed; findings are reported per-family with page-specific call-outs._

## Components (96)

All 48 domain components (`src/components/**`) audited across 6 clusters; the 48 `src/components/ui/**` shadcn primitives audited as 1 cluster focused on the visually-defining ones (button, card, input, form, dialog, tabs, table, badge, select, tooltip, sonner). See [components.md](./components.md).

| Cluster | Scope |
|---|---|
| Site chrome & shared marketing sections | 16 findings |
| Marketing templates & lead-capture forms | 12 findings |
| Assessment quiz & results | 15 findings |
| Product chrome, paywall & report shell | 12 findings |
| Product data-viz, tables & matrices | 15 findings |
| Product workflow tabs & cards | 15 findings |
| shadcn/ui primitives (themed look) | 9 findings |
