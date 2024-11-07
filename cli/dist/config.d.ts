import type { ConfigInterface } from "./cli_types.ts";
declare class Config implements ConfigInterface {
    files: string[];
    constructor(args: string[]);
}
export { Config };
