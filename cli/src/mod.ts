import type { ImporterInterface } from "./cli.js";

import { Config } from "./config.js";
import { run } from "./cli.js";
import { Collection } from "./deps.js";


const config = new Config(process.argv);

class Importer implements ImporterInterface {
  async load(uri: string): Promise<Collection[]> {
    const {collections} = await import(uri);
    return collections;
  }
}

const importer = new Importer();

await run(config, importer);