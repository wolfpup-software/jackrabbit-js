/**
 * give more space for tests to run
 * an implementation of a test run
 * the args provided
 * what runner will be run
 * callbacks for results
 */

interface Args {
  files: string[];
  addresses: string[];
  log: string;
  saveFile?: string;
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
