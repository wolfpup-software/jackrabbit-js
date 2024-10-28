import type { ImporterInterface } from "./cli_types.ts";
import type { Collection } from "./deps.ts";

let cwd = process.cwd();

class Importer implements ImporterInterface {
  async load(uri: string): Promise<Collection[]> {
    let uri_updated = uri;

    let absolute = uri.startsWith("/");
    if (!absolute) {
      uri_updated = cwd + "/" + uri;
    }

    const { collections } = await import(uri_updated);
    return collections;
  }
}

export { Importer };
