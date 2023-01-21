/*
  jackrabbit cli

  An example of how to build a cli with jackrabbit.

  Developers must define:
  	- importer
  	- logger
*/

import type { ImporterInterface } from "./cli/mod.ts";

import { Config, Logger, run } from "./cli/mod.ts";

class Importer implements ImporterInterface {
  async load(filename: string): Promise<Collection[]> {
    const { testCollections } = await import(filename);
    return testCollections;
  }
}

const config = new Config(Deno.args);
const importer = new Importer();
const logger = new Logger(config);

run(config, importer, logger);
