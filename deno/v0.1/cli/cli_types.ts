import { Collection } from "./deps.ts";

interface ConfigInterface {
  files: string[];
  log_style: string;
}

interface ImporterInterface {
  load(string): Promise<Collection[]>;
}

export type { ConfigInterface, ImporterInterface };
