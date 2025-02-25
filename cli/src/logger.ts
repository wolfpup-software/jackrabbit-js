import type {
	LoggerAction,
	LoggerInterface,
	TestModule,
} from "../../core/dist/mod.js";

class Logger implements LoggerInterface {
	#assertions: Map<number, Map<number, LoggerAction>> = new Map();
	failed: boolean = false;
	cancelled: boolean = false;
	#startTime: number = -1;
	#testTime: number = 0;

	log(testModules: TestModule[], action: LoggerAction) {
		if ("start_run" === action.type) {
			this.#startTime = action.time;
		}

		if ("cancel_run" === action.type) {
			this.cancelled = true;
			logAssertions(testModules, this.#assertions);
			logCancelled(this.#startTime, this.#testTime, action.time);
		}

		//  add to fails
		if ("end_test" === action.type && action?.assertions) {
			if (Array.isArray(action.assertions) && action.assertions.length === 0)
				return;

			this.#testTime += action.endTime - action.startTime;
			this.failed = true;

			let assertions = this.#assertions.get(action.moduleId);
			if (assertions) {
				assertions.set(action.testId, action);
			} else {
				this.#assertions.set(
					action.moduleId,
					new Map([[action.testId, action]]),
				);
			}
		}

		if ("end_run" === action.type) {
			logAssertions(testModules, this.#assertions);
			logResults(this.failed, this.#startTime, this.#testTime, action.time);
		}
	}
}

function logAssertions(
	testModules: TestModule[],
	fails: Map<number, Map<number, LoggerAction>>,
) {
	for (let [index, module] of testModules.entries()) {
		let failedTests = fails.get(index);
		if (undefined === failedTests) continue;

		const { tests, options } = module;
		console.log(options?.title ?? `test index: ${index}`);
		
		for (let [index, test] of tests.entries()) {
			let action = failedTests.get(index);
			if (action.type !== "end_test") continue;

			console.log(`
${test.name}
${action.assertions}`);
		}
	}

	// then just print the results
	for (let [index, module] of testModules.entries()) {
		let numFailedTests = fails.get(index)?.size ?? 0;

		const { tests, options } = module;

		console.log(`${options?.title ?? `test index: ${index}`}`);
		
		let numTests = tests.length;	
		let numTestsPassed = numTests - numFailedTests;
		
		console.log(`${numTestsPassed}/${numTests} tests passed`);
	}
}

function logCancelled(startTime: number, testTime: number, time: number) {
	const overhead = time - startTime;
	console.log(`
Results:
cancelled
  duration: ${testTime.toFixed(4)} mS
  overhead: ${overhead.toFixed(4)} mS`);
}

function logResults(
	failed: boolean,
	startTime: number,
	testTime: number,
	time: number,
) {
	const status = failed ? yellow("\u{2717} failed") : blue("\u{2714} passed");
	const overhead = time - startTime;
	console.log(`
Results:
${status}
    duration: ${testTime.toFixed(4)} mS
    overhead: ${overhead.toFixed(4)} mS`);
}

function blue(text: string) {
	return `\x1b[44m\x1b[39m${text}\x1b[0m`;
}

function yellow(text: string) {
	return `\x1b[43m\x1b[39m${text}\x1b[0m`;
}

export { Logger };
