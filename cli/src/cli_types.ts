import type { Collection } from "./deps.ts";

interface ConfigInterface {
  files: string[];
}

interface ImporterInterface {
  load(url: string): Promise<Collection[]>;
}

export type { ConfigInterface, ImporterInterface };
