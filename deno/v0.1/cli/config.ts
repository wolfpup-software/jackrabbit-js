/**
 * Brian Taylor Vann
 * config.ts
 */

import type { Args, ConfigInterface } from "./cli_types.ts";

type Reaction = (config: Args, value?: string) => void;
type Reactions = Record<string, Reaction>;

function logConfig(config: Args, value?: string) {
  if (value === undefined) return;

  config.log = value;
}

function fileConfig(config: Args, value?: string) {
  if (value === undefined) return;

  const files = value.split(",");
  config.files = [...config.files, ...files];
}

function addressConfig(config: Args, value?: string) {
  if (value === undefined) return;

  const addresses = value.split(",");
  config.addresses = [...config.addresses, ...addresses];
}

function saveResultsConfig(config: Args, value?: string) {
  config.saveFile = value ?? "./jr.json";
}

const reactions: Reactions = {
  "--log": logConfig,
  "-l": logConfig,
  "--file": fileConfig,
  "-f": fileConfig,
  "--address": addressConfig,
  "-a": addressConfig,
  "--save-results": saveResultsConfig,
  "-s": saveResultsConfig,
};

function iterateArgs(config: Args, args: string[]) {
  let index = 0;
  while (index < args.length) {
    const flag = args[index];
    const reaction = reactions[flag];
    if (reaction === undefined) {
      console.error(`unrecognized argument flag: ${flag}`);
      break;
    }

    const value = args[index + 1];
    if (reactions[value]) {
      console.error(`unrecognized argument value: ${value}`);
      break;
    }

    reaction(config, value);
    index += 2;
  }
}

function createConfig() {
  return {
    files: [],
    addresses: [],
    log: "voiced",
  };
}

class Config implements ConfigInterface {
  private config = createConfig();

  setArgs(args: string[]): void {
    this.config = createConfig();
    iterateArgs(this.config, args);
  }

  getConfig(): Args {
    return this.config;
  }
}

export { Config };
