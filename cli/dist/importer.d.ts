import type { TestModule } from "../../core/dist/mod.ts";
import type { ImporterInterface } from "./cli_types.ts";
declare class Importer implements ImporterInterface {
    #private;
    constructor(cwd: string);
    load(uri: string): Promise<TestModule[]>;
}
export { Importer };
