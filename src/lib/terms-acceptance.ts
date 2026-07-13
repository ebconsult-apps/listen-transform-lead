/**
 * Signup collects Terms-of-Service acceptance, but the account only exists after
 * the magic-link / OAuth round-trip completes. We stash the accepted version at
 * signup and write it to the profile once a session lands (see AuthCallback).
 *
 * This is same-browser only, which is the normal magic-link path (the user clicks
 * the link in the same browser that showed the signup form). A cross-device open
 * simply doesn't record here; that's acceptable for a versioned draft gate and can
 * be tightened later.
 */
const KEY = "clear.pending_terms_version";

/** Remember, at signup, which Terms version the user just agreed to. */
export function setPendingTermsAcceptance(version: string): void {
  try {
    localStorage.setItem(KEY, version);
  } catch {
    // ignore storage failures (private mode, disabled storage, etc.)
  }
}

/** Return and clear any pending accepted version. Call once, after auth. */
export function takePendingTermsAcceptance(): string | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v) localStorage.removeItem(KEY);
    return v;
  } catch {
    return null;
  }
}
