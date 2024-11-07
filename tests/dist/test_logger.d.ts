import type { LoggerAction, LoggerInterface, TestModule } from "../../core/dist/mod.ts";
declare class TestLogger implements LoggerInterface {
    cancelled: boolean;
    has_failed: boolean;
    log(_testModule: TestModule[], action: LoggerAction): void;
}
export { TestLogger };
