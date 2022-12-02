import type { ConfigInterface } from "./cli_types.ts";

type Reaction = (config: ConfigInterface, value?: string) => void;
type Reactions = Record<string, Reaction>;

const reactions: Reactions = {
  "--log": logConfig,
  "-l": logConfig,
  "--file": fileConfig,
  "-f": fileConfig,
};

function logConfig(config: ConfigInterface, value?: string) {
  if (value === undefined) return;

  config.log_style = value;
}

function fileConfig(config: ConfigInterface, value?: string) {
  if (value === undefined) return;

  const files = value.split(",");
  config.files = [...config.files, ...files];
}

function saveResultsConfig(config: ConfigInterface, value?: string) {
  if (value === undefined) return;

  config.save_file = value;
}

function iterateArgs(config: ConfigInterface, args: string[]) {
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

class Config implements ConfigInterface {
  files: string[] = [];
  log_style: string = "voiced";

  constructor(args: string) {
    iterateArgs(this, args);
  }
}

export { Config };
