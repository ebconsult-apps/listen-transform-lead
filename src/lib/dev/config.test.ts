import { afterEach, describe, expect, it } from "vitest";
import {
  DEV_ACCESS_ENABLED,
  devActive,
  effectiveAiMode,
  enterDevMode,
  exitDevMode,
  setDevAiMode,
} from "./config";

afterEach(() => exitDevMode());

describe("dev config", () => {
  it("is inactive by default and falls back to the env AI mode", () => {
    expect(devActive()).toBe(false);
    expect(effectiveAiMode()).toBe("stub");
  });

  it("activation respects the capability flag and drives the effective AI mode", () => {
    if (!DEV_ACCESS_ENABLED) {
      // Capability off (prod-like build): enter is a no-op; mode stays the env default.
      enterDevMode();
      expect(devActive()).toBe(false);
      expect(effectiveAiMode()).toBe("stub");
      return;
    }
    enterDevMode();
    expect(devActive()).toBe(true);
    setDevAiMode("live");
    expect(effectiveAiMode()).toBe("live");
    exitDevMode();
    expect(devActive()).toBe(false);
    expect(effectiveAiMode()).toBe("stub"); // inactive → back to the env default
  });
});
