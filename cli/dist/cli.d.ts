import type { ConfigInterface, ImporterInterface } from "./cli_types.ts";
import type { LoggerInterface } from "../../core/dist/mod.ts";
declare function run(config: ConfigInterface, importer: ImporterInterface, logger?: LoggerInterface): Promise<void>;
export { run };
