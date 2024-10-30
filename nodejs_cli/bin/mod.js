#!/usr/bin/env node
import { Config, Importer, JackrabbitError, run } from "./deps.js";
const config = new Config(process.argv);
const importer = new Importer(process.cwd());
try {
    await run(config, importer);
}
catch (e) {
    if (e instanceof JackrabbitError) {
        console.log(`Error: ${e.message}`);
    }
    process.exit(1);
}
