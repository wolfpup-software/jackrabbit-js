import type { ImporterInterface } from "./cli.js";

import { Config } from "./config.js";
import { run } from "./cli.js";
import { Collection } from "./deps.js";


let cwd = process.cwd();


const config = new Config(process.argv);

class Importer implements ImporterInterface {
  async load(uri: string): Promise<Collection[]> {
    let uri_updated = uri;
    
    let absolute = uri.startsWith("/");
    if (!absolute) {
      uri_updated = cwd +  "/"  + uri;
    }

    const {collections} = await import(uri_updated);
    return collections;
  }
}

const importer = new Importer();

await run(config, importer);