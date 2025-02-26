interface Stringable {
	toString: Object["toString"];
}

type Assertions = Stringable | Stringable[] | undefined;
type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type Test = SyncTest | AsyncTest;

interface Options {
	title?: string;
	runAsynchronously?: boolean;
	timeoutInterval?: number;
}

interface TestModule {
	tests: Test[];
	options: Options;
}

interface StartRun {
	type: "start_run";
	time: number;
}

interface EndRun {
	type: "end_run";
	time: number;
}

interface CancelRun {
	type: "cancel_run";
	time: number;
}

interface StartModule {
	type: "start_module";
	moduleId: number;
	time: number;
}

interface EndModule {
	type: "end_module";
	moduleId: number;
	time: number;
}

interface StartTest {
	type: "start_test";
	testId: number;
	moduleId: number;
	time: number;
}

interface EndTest {
	type: "end_test";
	testId: number;
	moduleId: number;
	startTime: number;
	endTime: number;
	assertions: Assertions;
}

type LoggerAction =
	| StartRun
	| EndRun
	| CancelRun
	| StartModule
	| EndModule
	| StartTest
	| EndTest;

interface LoggerInterface {
	readonly failed: boolean;
	readonly cancelled: boolean;
	log(testModules: TestModule[], action: LoggerAction): void;
}

export type {
	Assertions,
	LoggerAction,
	LoggerInterface,
	Test,
	Options,
	TestModule,
};
