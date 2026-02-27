import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  getOrderStatusColor,
  getOrderStatusText,
  getUserStatusColor,
  getUserStatusText,
  generateOrderNo,
  calculateDistance,
} from "../utils";

describe("utils.ts", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", false && "bar")).toBe("foo");
      expect(cn("foo", "bar", ["baz", "qux"])).toBe("foo bar baz qux");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(100)).toBe("¥100.00");
      expect(formatCurrency("99.99")).toBe("¥99.99");
      expect(formatCurrency(0)).toBe("¥0.00");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const result = formatDate("2024-01-15");
      expect(result).toContain("2024");
      expect(result).toContain("1");
      expect(result).toContain("15");
    });
  });

  describe("getOrderStatusColor", () => {
    it("should return correct colors for order statuses", () => {
      expect(getOrderStatusColor("PENDING")).toBe(
        "bg-yellow-100 text-yellow-800",
      );
      expect(getOrderStatusColor("COMPLETED")).toBe(
        "bg-green-100 text-green-800",
      );
      expect(getOrderStatusColor("CANCELED")).toBe("bg-red-100 text-red-800");
      expect(getOrderStatusColor("UNKNOWN")).toBe("bg-gray-100 text-gray-800");
    });
  });

  describe("getOrderStatusText", () => {
    it("should return correct text for order statuses", () => {
      expect(getOrderStatusText("PENDING")).toBe("待接单");
      expect(getOrderStatusText("ACCEPTED")).toBe("已接单");
      expect(getOrderStatusText("COMPLETED")).toBe("已完成");
      expect(getOrderStatusText("UNKNOWN")).toBe("UNKNOWN");
    });
  });

  describe("getUserStatusColor", () => {
    it("should return correct colors for user statuses", () => {
      expect(getUserStatusColor("PENDING")).toBe(
        "bg-yellow-100 text-yellow-800",
      );
      expect(getUserStatusColor("ACTIVE")).toBe("bg-green-100 text-green-800");
      expect(getUserStatusColor("SUSPENDED")).toBe("bg-red-100 text-red-800");
    });
  });

  describe("getUserStatusText", () => {
    it("should return correct text for user statuses", () => {
      expect(getUserStatusText("PENDING")).toBe("待审核");
      expect(getUserStatusText("ACTIVE")).toBe("正常");
      expect(getUserStatusText("INACTIVE")).toBe("已禁用");
    });
  });

  describe("generateOrderNo", () => {
    it("should generate order number with correct prefix", () => {
      const orderNo = generateOrderNo();
      expect(orderNo).toMatch(/^ORD[A-Z0-9]+$/);
      expect(orderNo.length).toBeGreaterThan(10);
    });

    it("should generate unique order numbers", () => {
      const orderNos = new Set(
        Array.from({ length: 100 }, () => generateOrderNo()),
      );
      expect(orderNos.size).toBe(100);
    });
  });

  describe("calculateDistance", () => {
    it("should calculate distance between two points correctly", () => {
      const distance = calculateDistance(31.2304, 121.4737, 31.2304, 121.4737);
      expect(distance).toBe(0);
    });

    it("should calculate distance between Beijing and Shanghai (approximately 1068km)", () => {
      const distance = calculateDistance(39.9042, 116.4074, 31.2304, 121.4737);
      expect(distance).toBeGreaterThan(1000);
      expect(distance).toBeLessThan(1100);
    });
  });
});
