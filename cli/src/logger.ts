import type {
	LoggerAction,
	LoggerInterface,
	TestModule,
} from "../../core/dist/mod.js";

class Logger implements LoggerInterface {
	#assertions: Map<number, Map<number, LoggerAction>> = new Map();
	#cancelled: boolean;
	#failed: boolean = false;
	#startTime: number = -1;
	#testTime: number = 0;

	get failed() {
		return this.#failed;
	}

	get cancelled() {
		return this.#cancelled;
	}

	log(testModules: TestModule[], action: LoggerAction) {
		if ("start_run" === action.type) {
			this.#startTime = action.time;
		}

		if ("cancel_run" === action.type) {
			this.#cancelled = true;
			logAssertions(testModules, this.#assertions);
			logResults(
				this.#failed,
				this.#cancelled,
				this.#startTime,
				this.#testTime,
				action.time,
			);
		}

		//  add to fails
		if ("end_test" === action.type && action?.assertions) {
			if (Array.isArray(action.assertions) && action.assertions.length === 0)
				return;

			this.#testTime += action.endTime - action.startTime;
			this.#failed = true;

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
			logResults(
				this.#failed,
				this.#cancelled,
				this.#startTime,
				this.#testTime,
				action.time,
			);
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

		console.log(`  ${numTestsPassed}/${numTests} tests passed`);
	}
}

function logResults(
	failed: boolean,
	cancelled: boolean,
	startTime: number,
	testTime: number,
	time: number,
) {
	let status_with_color = failed
		? yellow("\u{2717} failed")
		: blue("\u{2714} passed");

	if (cancelled) {
		status_with_color = gray("\u{2717} cancelled");
	}

	const overhead = time - startTime;
	console.log(`
Results:
${status_with_color}
  duration: ${testTime.toFixed(4)} mS
  overhead: ${overhead.toFixed(4)} mS`);
}

// 39 - default foreground color
// 49 - default background color
function blue(text: string) {
	return `\x1b[44m\x1b[97m${text}\x1b[0m`;
}

function yellow(text: string) {
	return `\x1b[43m\x1b[97m${text}\x1b[0m`;
}

function gray(text: string) {
	return `\x1b[100m\x1b[97m${text}\x1b[0m`;
}

export { Logger };
