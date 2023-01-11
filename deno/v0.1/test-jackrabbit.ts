/*
  jackrabbit cli

  An example of how to make a cli for other projects.

  Developers should have control over:
  	- imports
  	- logs (callbacks)
  	- how tests are run
*/

import type { ImporterInterface } from "./cli/mod.ts";

import { Config, Logger, run } from "./cli/mod.ts";

class Importer implements ImporterInterface {
  async load(filename: string): Promise<Collection[]> {
    const { tests } = await import(filename);
    return tests;
  }
}

const config = new Config(Deno.args);
const importer = new Importer();
const logger = new Logger(config);

run(config, importer, logger);
