import { Config } from "./config.ts";
import { Runner } from "./runner.ts";
import { Logs } from "./logs.ts";

const config = new Config();
config.setArgs(Deno.args);

const logs = new Logs();

const runner = new Runner();
runner.run(config, logs);
