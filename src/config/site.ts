/**
 * Site-wide configuration. Single place to update external IDs and URLs.
 */

/** Outlook "Book with me" discovery-call link used by every booking CTA. */
export const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

/**
 * Google Ads account tag, e.g. "AW-123456789".
 * Found in Google Ads → Goals → Conversions → any conversion action → Tag setup.
 * Leave empty until set up; the Ads tag is only configured when present.
 */
export const GOOGLE_ADS_ID = "";

/**
 * Google Ads conversion labels, format "AW-123456789/AbCdEfGh".
 * Created in Google Ads → Goals → Conversions → New conversion action → Website.
 * While these are placeholders, trackGoogleAdsConversion() skips firing so no
 * invalid conversion events are sent. Paste the real values here and every
 * form is wired up — no other file needs to change.
 */
export const CONVERSION_LABELS = {
  contactForm: "AW-XXXXXXXXX/CONTACT_FORM",
  bookInterest: "AW-XXXXXXXXX/BOOK_INTEREST",
  assessmentReport: "AW-XXXXXXXXX/ASSESSMENT_REPORT",
  whitepaper: "AW-XXXXXXXXX/WHITEPAPER",
  freeChapter: "AW-XXXXXXXXX/FREE_CHAPTER",
  consultation: "AW-XXXXXXXXX/CONSULTATION",
} as const;
