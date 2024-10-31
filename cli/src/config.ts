import type { ConfigInterface } from "./cli_types.ts";

type Reaction = (config: ConfigInterface, value?: string) => void;
type Reactions = Record<string, Reaction>;

// map
const reactions: Reactions = {
  "--file": fileConfig,
  "-f": fileConfig,
};

function fileConfig(config: ConfigInterface, value?: string) {
  if (value === undefined) return;

  const files = value.split(",");
  config.files = [...config.files, ...files];
}

function iterateArgs(config: ConfigInterface, args: string[]) {
  let index = 0;
  while (index < args.length) {
    const flag = args[index];
    const reaction = reactions[flag];
    if (reaction === undefined) {
      throw new Error(`unrecognized argument: ${flag}`);
    }

    reaction(config, args[index + 1]);
    index += 2;
  }
}

class Config implements ConfigInterface {
  files: string[] = [];

  constructor(args: string[]) {
    iterateArgs(this, args);
  }
}

export { Config };
