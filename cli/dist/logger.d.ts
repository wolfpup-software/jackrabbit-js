import type { LoggerAction, LoggerInterface, TestModule } from "../../core/dist/mod.js";
declare class Logger implements LoggerInterface {
    #private;
    failed: boolean;
    cancelled: boolean;
    log(testModules: TestModule[], action: LoggerAction): void;
}
export { Logger };
