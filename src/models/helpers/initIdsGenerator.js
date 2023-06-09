import { readdirSync } from "node:fs";
//doing not async to make sure is blocking at the start or server restart
function* initIdsGenerator(folder) {
  let files = readdirSync(folder);
  let id = 1;
  if (files.length > 0) {
    id = Math.max(...files.map((name) => Number(name.replace(".json", "")))) + 1;
  }
  while (true) {
    yield id++;
  }
}
export default initIdsGenerator;
