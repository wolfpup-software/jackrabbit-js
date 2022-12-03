import type {
  Collection,
  ImporterInterface,
  LoggerInterface,
  StoreAction,
  StoreDataInterface,
} from "../../deno/v0.1/core/mod.ts";
4;
import { Runner, Store } from "../../deno/v0.1/core/mod.ts";

class Importer implements ImporterInterface {
  async load(filename: string): Promise<Collection[]> {
    const { tests } = await import(filename);
    return tests;
  }
}

class Logger implements LoggerInterface {
  log(data: StoreDataInterface, action: StoreAction) {
    if (root === null) {
      return;
    }

    let message = "";
    switch (action.type) {
      case "end_test":
        const testResult = data.testResults[action.testResultID];
        message = `test *${testResult.status}* in ${
          testResult.endTime - testResult.startTime
        }`;

        break;
      case "end_collection":
        const collecitonResult =
          data.collectionResults[action.collectionResultID];
        message =
          `collection *${collecitonResult.status}* in ${collecitonResult.testTime}`;

        break;
      case "end_run":
        message = `run *${data.status}* in ${data.testTime}`;
        break;
    }

    const textNode = document.createTextNode(
      `${action.type} : ${message}`,
    );
    const node = document.createElement("div");
    node.appendChild(textNode);

    if (root.firstChild === null) {
      root.appendChild(node);
    } else {
      root.insertBefore(node, root.firstChild);
    }
  }
}

async function run(
  files: string[],
  importer: ImporterInterface,
  logs: LoggerInterface,
) {
  for (const file of files) {
    const tests = await importer.load(file);

    const store = new Store(tests, logs);
    const runner = new Runner();
    await runner.run(store);
  }
}

const root = document.querySelector("section");

const files = ["./jackrabbit.test.js"];
const importer = new Importer();
const logger = new Logger();

run(files, importer, logger);
