import { describe, it, expect } from "vitest";
import { calculateDistance, GeoLocation } from "../map";

describe("map.ts", () => {
  describe("calculateDistance", () => {
    it("should return 0 for same location", () => {
      const location1: GeoLocation = { lat: 31.2304, lng: 121.4737 };
      const location2: GeoLocation = { lat: 31.2304, lng: 121.4737 };

      const distance = calculateDistance(location1, location2);
      expect(distance).toBe(0);
    });

    it("should calculate short distance correctly", () => {
      const location1: GeoLocation = { lat: 31.2304, lng: 121.4737 };
      const location2: GeoLocation = { lat: 31.2314, lng: 121.4737 };

      const distance = calculateDistance(location1, location2);
      expect(distance).toBeGreaterThan(100);
      expect(distance).toBeLessThan(200);
    });

    it("should calculate Beijing to Shanghai distance correctly", () => {
      const beijing: GeoLocation = { lat: 39.9042, lng: 116.4074 };
      const shanghai: GeoLocation = { lat: 31.2304, lng: 121.4737 };

      const distance = calculateDistance(beijing, shanghai);
      expect(distance).toBeGreaterThan(1000000);
      expect(distance).toBeLessThan(1100000);
    });

    it("should handle negative latitudes and longitudes", () => {
      const tokyo: GeoLocation = { lat: 35.6762, lng: 139.6503 };
      const sydney: GeoLocation = { lat: -33.8688, lng: 151.2093 };

      const distance = calculateDistance(tokyo, sydney);
      expect(distance).toBeGreaterThan(7000000);
      expect(distance).toBeLessThan(8000000);
    });
  });
});
