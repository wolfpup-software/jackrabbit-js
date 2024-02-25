import type { Collection, LoggerInterface } from "../utils/jackrabbit_types.ts";
declare function startRun(collections: Collection[], logger: LoggerInterface): Promise<void>;
declare function cancelRun(collections: Collection[], logger: LoggerInterface): void;
export { cancelRun, startRun };
//# sourceMappingURL=run_steps.d.ts.map