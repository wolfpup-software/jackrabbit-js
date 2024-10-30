import type { ImporterInterface } from "./cli_types.js";
import type { Collection } from "./deps.js";

class Importer implements ImporterInterface {
  #cwd: string;

  constructor(cwd: string) {
    this.#cwd = cwd;
  }

  async load(uri: string): Promise<Collection[]> {
    let uri_updated = uri;

    let absolute = uri.startsWith("/");
    if (!absolute) {
      uri_updated = this.#cwd + "/" + uri;
    }

    const { collections } = await import(uri_updated);
    return collections;
  }
}

export { Importer };
