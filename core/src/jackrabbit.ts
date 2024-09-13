import type { LoggerInterface, Collection } from "./jackrabbit_types.js";
import { startRun, cancelRun } from "./run_steps.js";

class Jackrabbit {
	#logger: LoggerInterface;
	#collections: Collection[];

	constructor(logger: LoggerInterface, collections: Collection[]) {
		this.#logger = logger;
		this.#collections = collections;
	}

	start() {
		startRun(this.#logger, this.#collections);
	}

	stop() {
		cancelRun(this.#logger, this.#collections);
	}
}

export { Jackrabbit };
