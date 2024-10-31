import type { TestModule } from "./deps.ts";

interface ConfigInterface {
  files: string[];
}

interface ImporterInterface {
  load(url: string): Promise<TestModule[]>;
}

class JackrabbitError extends Error {}

export type { ConfigInterface, ImporterInterface, TestModule };

export { JackrabbitError };
