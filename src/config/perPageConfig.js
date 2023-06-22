import readline from "node:readline/promises";
import inventoryModel from "../models/inventoryModel.js";
import { CHANGE_PER_PAGE_BY_INPUT } from "./config.js";

let defaultItemsPerPage = process.env.DEFAULT_ITEMS_PER_PAGE;
let minItemsPerPage = process.env.MIN_ITEMS_PER_PAGE;
let maxItemsPerPage = process.env.MAX_ITEMS_PER_PAGE;

if (CHANGE_PER_PAGE_BY_INPUT) {
  const allRecordsCount = await inventoryModel.getCount();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const yes = { inputs: ["y", "Y", "yes", "Yes", "YES"], value: true };
  const no = { inputs: ["n", "N", "no", "No", "NO"], value: false };
  const quit = { inputs: ["q", "Q", "quit", "Quit", "QUIT"], action: rl.close };

  const checkIfToUseDefaults = async () => {
    const useDefaults = await rl.question(`
There are ${allRecordsCount} inventory items in db.
Current configuration for
DEFAULT_ITEMS_PER_PAGE are: ${defaultItemsPerPage},
MIN_ITEMS_PER_PAGE: ${minItemsPerPage},
MAX_ITEMS_PER_PAGE: ${maxItemsPerPage}.
You can change these settings permanently by changing ENV
You can turn off these prompts by setting env CHANGE_PER_PAGE_BY_INPUT to false;
Do You want to change these settings temporary? (y/n)
`);
    if (yes.inputs.includes(useDefaults)) {
      return yes.value;
    }
    if (no.inputs.includes(useDefaults)) {
      return no.value;
    }
    return checkIfToUseDefaults();
  };

  const needsChangingDefaults = await checkIfToUseDefaults();

  if (needsChangingDefaults) {
    const getDefaultPageSize = async (msg = "Enter default items count per page") => {
      let defaultSize = await rl.question(msg + ":");
      defaultSize = Math.round(Number(defaultSize));
      if (!isNaN(defaultSize) && defaultSize > 0 && defaultSize <= allRecordsCount) {
        return defaultSize;
      }
      return getDefaultPageSize(`${msg} as number(1-${allRecordsCount})`);
    };

    const getMinPageSize = async (msg = "Enter minimum items count per page") => {
      let minSize = await rl.question(msg + ":");
      minSize = Math.round(Number(minSize));
      if (!isNaN(minSize) && minSize <= allRecordsCount && minSize > 0) {
        return minSize;
      }
      return getMinPageSize(`${msg} as number(1-${allRecordsCount})`);
    };

    const getMaxPageSize = async (msg = "Enter maximum items count per page") => {
      let maxSize = await rl.question(msg + ":");
      maxSize = Math.round(Number(maxSize));
      if (!isNaN(maxSize) && maxSize > 0) {
        return maxSize;
      }
      return getMaxPageSize(`${msg} as number(1-${allRecordsCount})`);
    };

    defaultItemsPerPage = await getDefaultPageSize();
    minItemsPerPage = await getMinPageSize();
    maxItemsPerPage = await getMaxPageSize();
  }
  console.log(`Current configuration for
DEFAULT ITEMS PER PAGE are: ${defaultItemsPerPage},
MIN ITEMS PER PAGE: ${minItemsPerPage},
MAX ITEMS PER PAGE: ${maxItemsPerPage}.`);
}

export { defaultItemsPerPage, minItemsPerPage, maxItemsPerPage };
