import { mkdirSync } from "node:fs";

//doing not async to make sure is blocking at the start or server restart
function makeSureIsFolder(path) {
  try {
    mkdirSync(path);
    return true;
  } catch (e) {
    if (e.code == "EEXIST") {
      return true;
    }
    throw new Error("could not create folder");
  }
}

export default makeSureIsFolder;
