#!/usr/bin/env node
import { Config, Importer, JackrabbitError, run } from "./deps.js";
const config = new Config(process.argv.slice(2));
const importer = new Importer(process.cwd());
// process exit depending on error
try {
    await run(config, importer);
    process.exit(0);
}
catch (e) {
    if (e instanceof Error && !(e instanceof JackrabbitError)) {
        console.log(`
Error:
${e.name}
${e.message}
${e.stack}`);
    }
    process.exit(1);
}
