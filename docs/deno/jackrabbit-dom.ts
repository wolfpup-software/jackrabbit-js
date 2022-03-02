import type { ResultsBroadcast } from "../../v0.1/deno/src/jackrabbit.ts";

import { Jackrabbit } from "../../v0.1/deno/src/jackrabbit.ts";

const root = document.querySelector("section");

const jr = new Jackrabbit();

const log = (broadcast: ResultsBroadcast) => {
  const { action, data } = broadcast;

  console.log("*******************");
  console.log(action);
  console.log(data);

  if (root === null) {
    return;
  }

  let message = "";
  switch (action.kind) {
    case "end_unit_test":
      const testResult = data.testResults[action.unitTestResultID];
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
      const runResult = data.runResults[action.runResultID];
      message = `run *${runResult.status}* in ${runResult.testTime}`;
      break;
  }

  const textNode = document.createTextNode(
    `${action.kind} : ${message}`,
  );
  const node = document.createElement("div");
  node.appendChild(textNode);

  if (root.firstChild === null) {
    root.appendChild(node);
  } else {
    root.insertBefore(node, root.firstChild);
  }
};

jr.subscribe(log);

const loadAndRunTests = async () => {
  const { tests } = await import("./jackrabbit.test.js");
  const receipt = jr.buildRun(tests);
  jr.startRun(receipt);
};

loadAndRunTests();
