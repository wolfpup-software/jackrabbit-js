import { Config, Importer, run } from "./deps.js";
const config = new Config(process.argv);
const importer = new Importer();
try {
    await run(config, importer);
}
catch (e) {
    if (e instanceof Error) {
        console.log(e.message);
    }
    process.exit(1);
}
