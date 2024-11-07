const reactions = {
    "--file": fileConfig,
    "-f": fileConfig,
};
function fileConfig(config, file) {
    if (file === undefined)
        return;
    config.files.push(file);
}
function iterateArgs(config, args) {
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
class Config {
    files = [];
    constructor(args) {
        iterateArgs(this, args);
    }
}
export { Config };
