import type { ConfigInterface, ImporterInterface } from "./cli_types.ts";
import type { LoggerInterface } from "./deps.ts";

import { startRun } from "./deps.js";

async function run(
  config: ConfigInterface,
  importer: ImporterInterface,
  logger: LoggerInterface,
) {
  for (const file of config.files) {
    const collections = await importer.load(file);
    await startRun(collections, logger);
  }
}

export { run };
