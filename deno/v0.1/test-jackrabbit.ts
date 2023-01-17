/*
  jackrabbit cli

  An example of how to make a cli for other projects.

  Developers should have control over:
  	- imports
  	- logs (callbacks)
  	- how tests are run
*/

import type { ImporterInterface } from "./cli/mod.ts";

import { createConfig, Logger, run } from "./cli/mod.ts";

class Importer implements ImporterInterface {
  async load(filename: string): Promise<Collection[]> {
    const { testCollections } = await import(filename);
    return testCollections;
  }
}

const config = createConfig(Deno.args);
const importer = new Importer();
const logger = new Logger(config);

run(config, importer, logger);
