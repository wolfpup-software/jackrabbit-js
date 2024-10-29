import type { Collection } from "./deps.ts";

interface ConfigInterface {
  files: string[];
}

interface ImporterInterface {
  load(url: string): Promise<Collection[]>;
}

class JackrabbitError extends Error {}

export type { ConfigInterface, ImporterInterface };

export { JackrabbitError };
