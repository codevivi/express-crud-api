import { readFileSync, readdirSync } from "node:fs";
import Trie from "./Trie.js";

//doing not async to make sure is blocking at the start or server restart

function initTrie(folder, fieldToIndexedTrie, allowedChars) {
  const files = readdirSync(folder);
  const dataArr = files.map((file) => readFileSync(`${folder}/${file}`, "utf-8"));
  let fieldsToTrie = dataArr.map((item) => {
    let dataItem = JSON.parse(item);
    return { id: dataItem.id, field: dataItem[fieldToIndexedTrie] };
  });
  let trie = new Trie(allowedChars);
  fieldsToTrie.forEach((item) => {
    trie.insert(item.field, item.id);
  });
  return trie;
}

export default initTrie;
