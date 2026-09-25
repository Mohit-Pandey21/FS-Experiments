import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW Node server for Vitest test suite execution
export const server = setupServer(...handlers);
