import { StoreAction, StoreData } from "./deps.ts";

interface ConfigInterface {
  files: string[];
  log_style: string;
}

// Might need a separate 'fetch' command for remote stuff
interface ImporterInterface {
  load: (filename: string) => Promise<Collection>;
}

interface LogInterface {
  log(args: Args, data: StoreData, action: StoreAction);
}

export type { ConfigInterface, ImporterInterface, LogInterface };
