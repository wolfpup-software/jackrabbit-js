// move this to core

import { Config, Logs, run } from "./cli/mod.ts";

class Importer {
  async load(filename: string): Collection {
    return await import(filename);
  }
}

const config = new Config(Deno.args);
const importer = new Importer();
const logs = new Logs(config);

run(config, importer, logs);
