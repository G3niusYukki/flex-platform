import { describe, it, expect } from "vitest";
import { checkLoginRisk, checkRegistrationRisk } from "../risk-control";

describe("risk-control.ts", () => {
  describe("checkLoginRisk", () => {
    it("should return low risk for first login attempt", async () => {
      const result = await checkLoginRisk(
        "13812345678",
        "192.168.1.1",
        "Mozilla/5.0",
      );

      expect(result.passed).toBe(true);
      expect(result.riskLevel).toBe("low");
      expect(result.action).toBe("allow");
    });

    it("should detect suspicious user agent", async () => {
      const result = await checkLoginRisk(
        "13812345679",
        "192.168.1.2",
        "python-requests/2.28",
      );

      expect(result.reasons).toContain("可疑的客户端");
      expect(result.riskLevel).toBe("medium");
    });
  });

  describe("checkRegistrationRisk", () => {
    it("should return low risk for first registration", async () => {
      const result = await checkRegistrationRisk("192.168.1.100");

      expect(result.passed).toBe(true);
      expect(result.riskLevel).toBe("low");
    });

    it("should return high risk for too many registrations from same IP", async () => {
      for (let i = 0; i < 5; i++) {
        await checkRegistrationRisk("192.168.1.101");
      }

      const result = await checkRegistrationRisk("192.168.1.101");

      expect(result.riskLevel).toBe("high");
      expect(result.passed).toBe(false);
      expect(result.action).toBe("block");
    });

    it("should return medium risk for multiple registrations from same IP", async () => {
      await checkRegistrationRisk("192.168.1.102");
      await checkRegistrationRisk("192.168.1.102");
      await checkRegistrationRisk("192.168.1.102");

      const result = await checkRegistrationRisk("192.168.1.102");

      expect(result.riskLevel).toBe("medium");
      expect(result.action).toBe("captcha");
    });
  });
});
