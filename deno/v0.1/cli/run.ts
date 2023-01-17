import type { ConfigInterface, ImporterInterface } from "./cli_types.ts";
import type { LoggerInterface } from "./deps.ts";

import { cancelRun, execRun } from "./deps.ts";

async function run(
  config: ConfigInterface,
  importer: ImporterInterface,
  logger: LoggerInterface,
) {
  for (const file of config.files) {
    const collections = await importer.load(file);
    await execRun(collections, logger);
  }
}

export { run };
