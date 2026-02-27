import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    workerProfile: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    employerProfile: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    dispatchRecord: {
      create: vi.fn(),
    },
  },
}));
