import { Config, Logs, run } from "./cli/mod.ts";

class Importer {
  async load(filename: string): Collection {
    return await import(filename);
  }
}

const importer = new Importer();
const config = new Config(Deno.args);
const logs = new Logs(config);

run(config, importer, logs);
