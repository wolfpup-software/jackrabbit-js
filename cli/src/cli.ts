import type { ConfigInterface, ImporterInterface } from "./cli_types.ts";
import type { LoggerInterface } from "./deps.ts";

import { startRun } from "./deps.js";
import { Logger } from "./logger.js";

async function run(
  config: ConfigInterface,
  importer: ImporterInterface,
  logger: LoggerInterface = new Logger(),
) {
  for (const file of config.files) {
    const testModules = await importer.load(file);

    // verify tests and details

    await startRun(logger, testModules);
  }
}

// create details object
// title

export { Logger } from "./logger.js";
export { Config } from "./config.js";
export { run };
