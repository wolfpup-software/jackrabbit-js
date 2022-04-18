/**
 * Brian Taylor Vann
 * args.ts
 */

const flags = new Set([
    "--quiet",
    "-q",
    "--silent",
    "-s",
    "--loud",
    "-v",
    "--file",
    "-f",
    "--address",
    "-a",
    "--save-results"
])

interface RunConfig {
    files: [],
    addresses: [],
    output: "silent" | "quiet" | "voiced" | "loud"
    fileRecord?: string;
}

const config: RunConfig = {
    files: [],
    addresses: [],
    output: "voiced",
    fileRecord: undefined,
}

// iterate across args

// if arg is apart of menu
let index = 0;
let valueIndex = 0;

while (valueIndex < Deno.args.length) {
    const arg = Deno.args[index];
    console.log(arg);

    if (flags.has(arg)) {
        console.log("flag found!")
    }
    valueIndex = index + 1
    if (valueIndex >= Deno.args.length) {
        console.log("next args is undeinfed")
        break;
    }
    const potentialValue = Deno.args[valueIndex];
    if (flags.has(potentialValue)) {
        console.log("next args is a cli arg:", potentialValue)!
        console.log("create default command");
    } else {
        console.log("found value:", potentialValue)
    }

    index += 1
    valueIndex = index;
}

for (const arg of Deno.args) {
    if (!flags.has(arg)) {
        console.error(`unrecognized argument: ${arg}`);
        Deno.exit(1);
        break;
    };

    console.log(arg)
}