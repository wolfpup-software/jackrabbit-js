interface Args {
  files: string[];
  addresses: string[];
  log: string;
}

interface ConfigInterface {
  setArgs(args: string[]): void;
  getConfig(): Args;
}

interface RunnerInterface {
  build(config: Args): void;
  exec(): void;
}

export type { Args, ConfigInterface, RunnerInterface };
