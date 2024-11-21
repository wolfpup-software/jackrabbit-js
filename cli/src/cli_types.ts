import type { TestModule } from "../../core/dist/mod.ts";

interface ConfigInterface {
	files: string[];
}

interface ImporterInterface {
	load(url: string): Promise<TestModule[]>;
}

export type { ConfigInterface, ImporterInterface };
