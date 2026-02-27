import { describe, it, expect, beforeEach } from "vitest";
import {
  encrypt,
  decrypt,
  encryptIdCardUrl,
  decryptIdCardUrl,
  encryptHealthCertUrl,
  decryptHealthCertUrl,
  maskPhone,
  maskIdCard,
  maskName,
  generateSecureUrl,
  verifySecureUrl,
} from "../crypto";

describe("crypto.ts", () => {
  describe("encrypt/decrypt", () => {
    it("should encrypt and decrypt text correctly", () => {
      const original = "Hello World 你好世界";
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(original);
      expect(decrypted).toBe(original);
    });

    it("should return null for invalid encrypted text", () => {
      expect(decrypt("invalid")).toBeNull();
      expect(decrypt("")).toBeNull();
    });

    it("should produce different ciphertext for same input (random IV)", () => {
      const original = "test text";
      const encrypted1 = encrypt(original);
      const encrypted2 = encrypt(original);

      expect(encrypted1).not.toBe(encrypted2);
      expect(decrypt(encrypted1)).toBe(original);
      expect(decrypt(encrypted2)).toBe(original);
    });
  });

  describe("encryptIdCardUrl/decryptIdCardUrl", () => {
    it("should encrypt and decrypt URL correctly", () => {
      const url = "https://example.com/idcard/123456.jpg";
      const encrypted = encryptIdCardUrl(url);
      const decrypted = decryptIdCardUrl(encrypted);

      expect(encrypted).not.toBe(url);
      expect(decrypted).toBe(url);
    });
  });

  describe("encryptHealthCertUrl/decryptHealthCertUrl", () => {
    it("should encrypt and decrypt health certificate URL correctly", () => {
      const url = "https://example.com/health/abc123.jpg";
      const encrypted = encryptHealthCertUrl(url);
      const decrypted = decryptHealthCertUrl(encrypted);

      expect(encrypted).not.toBe(url);
      expect(decrypted).toBe(url);
    });
  });

  describe("maskPhone", () => {
    it("should mask phone number correctly", () => {
      expect(maskPhone("13812345678")).toBe("138****5678");
      expect(maskPhone("13900001111")).toBe("139****1111");
    });

    it("should return original for invalid phone", () => {
      expect(maskPhone("")).toBe("");
      expect(maskPhone("12345")).toBe("12345");
    });
  });

  describe("maskIdCard", () => {
    it("should mask ID card number correctly", () => {
      expect(maskIdCard("110101199001011234")).toBe("110***********1234");
    });

    it("should return original for invalid ID card", () => {
      expect(maskIdCard("")).toBe("");
      expect(maskIdCard("123")).toBe("123");
    });
  });

  describe("maskName", () => {
    it("should mask name correctly", () => {
      expect(maskName("张三")).toBe("张*");
      expect(maskName("李四")).toBe("李*");
      expect(maskName("王小明")).toBe("王**");
      expect(maskName("约翰逊")).toBe("约**");
    });

    it("should return original for invalid name", () => {
      expect(maskName("")).toBe("");
      expect(maskName("张")).toBe("张");
    });
  });

  describe("generateSecureUrl/verifySecureUrl", () => {
    it("should generate and verify secure URL correctly", () => {
      const originalUrl = "https://example.com/idcard/123456.jpg";
      const encryptedUrl = encryptIdCardUrl(originalUrl);
      const secureUrl = generateSecureUrl(encryptedUrl, 300);

      expect(secureUrl).toContain("expires=");
      expect(secureUrl).toContain("sig=");

      const result = verifySecureUrl(secureUrl);
      expect(result.valid).toBe(true);
      expect(result.decryptedUrl).toBe(originalUrl);
    });

    it("should return invalid for expired URL", () => {
      const encryptedUrl = "test-url";
      const expiredUrl = generateSecureUrl(encryptedUrl, -1);

      const result = verifySecureUrl(expiredUrl);
      expect(result.valid).toBe(false);
      expect(result.decryptedUrl).toBeNull();
    });

    it("should return invalid for tampered URL", () => {
      const encryptedUrl = "test-url";
      const secureUrl = generateSecureUrl(encryptedUrl, 300);
      const tamperedUrl = secureUrl.replace("sig=", "sig=tampered");

      const result = verifySecureUrl(tamperedUrl);
      expect(result.valid).toBe(false);
    });

    it("should return invalid for URL without query string", () => {
      const result = verifySecureUrl("just-url");
      expect(result.valid).toBe(false);
    });
  });
});
