// Example Jackrabbit CLI for NodeJS

// get args

// pass args to config

// create a jackrabbit instance

// start tests

import type { ConfigInterface, ImporterInterface } from "./cli_types.ts";
import type { LoggerInterface } from "./deps.ts";

import { Logger } from "./logger.js";

async function run(
  config: ConfigInterface,
  importer: ImporterInterface,
  logger: LoggerInterface = new Logger(),
) {
  for (const file of config.files) {
    const collections = await importer.load(file);
    // await startRun(collections, logger);
  }
}

export type { ImporterInterface } from "./cli_types.ts";

export { Logger } from "./logger.js";
export { Config } from "./config.js";
export { run };
