import "@testing-library/jest-dom";
import { server } from "../mocks/server";
import { beforeAll, afterEach, afterAll } from "vitest";

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset any request handlers that may be added during tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
