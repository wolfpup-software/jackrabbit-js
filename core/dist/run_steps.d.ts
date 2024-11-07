import type { LoggerInterface, TestModule } from "./jackrabbit_types.js";
declare function startRun(logger: LoggerInterface, testModules: TestModule[]): Promise<void>;
declare function cancelRun(logger: LoggerInterface, testModules: TestModule[]): void;
export { startRun, cancelRun };
