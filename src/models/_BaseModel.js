import { writeFile, readdir, readFile } from "node:fs/promises";
import { DB_BASE_PATH } from "../config/config.js";
import { validateString, validateNumber } from "./helpers/validators.js";
import makeSureIsFolder from "./helpers/makeSureIsFolder.js";
import initIdsGenerator from "./helpers/initIdsGenerator.js";
import CustomError from "../utils/CustomError.js";
import initTrie from "./helpers/initTrie.js";

class _BaseModel {
  //if fields left default false, means all entries allowed and not validated;
  constructor(folderName, fields = false, fieldToIndexedTrie = false) {
    const folder = `${DB_BASE_PATH}/${folderName}`;
    this.folder = folder;
    makeSureIsFolder(folder);
    this.fields = fields;
    this._idGenerator = initIdsGenerator(folder);
    this.fieldToIndexedTrie = fieldToIndexedTrie;
    this.trie = fieldToIndexedTrie ? initTrie(folder, fieldToIndexedTrie, fields[fieldToIndexedTrie].allowedChars.chars) : null;
    if (this.constructor.name === "BaseModel") {
      throw new Error("BaseModel class can only be extended");
    }
  }

  get newId() {
    return this._idGenerator.next().value;
  }

  async add(data) {
    data = this.validateInsertData(data);
    data.id = this.newId;
    data.creationTime = Date.now();
    const filePath = `${this.folder}/${data.id}.json`;
    let jsonData = JSON.stringify(data);
    await writeFile(filePath, jsonData);
    if (this.trie) {
      this.trie.insert(data[this.fieldToIndexedTrie], data.id);
    }
    return data.id;
  }

  async getById(id) {
    try {
      const item = await readFile(`${this.folder}/${id}.json`, "utf-8");
      return JSON.parse(item);
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new CustomError(404, "failure", "Inventory item with this id not found");
      }
    }
  }

  async getCount() {
    const files = await readdir(this.folder);
    return files.length;
  }

  async getAll() {
    const files = await readdir(this.folder);
    const dataArr = await Promise.all(files.map((file) => readFile(`${this.folder}/${file}`, "utf-8")));
    return dataArr.map((item) => JSON.parse(item));
  }

  async getPage(page, size) {
    const allSortedIdsByMainField = this.trie.findAllWordsSorted();
    const idsPageChunk = allSortedIdsByMainField.slice((page - 1) * size, page * size);
    const dataArr = await Promise.all(idsPageChunk.map((id) => readFile(`${this.folder}/${id}.json`, "utf-8")));
    return dataArr.map((item) => JSON.parse(item));
  }

  validateInsertData(entry) {
    if (!this.fields) {
      return entry;
    }
    const entryFieldsLength = Object.keys(entry).length;
    const requiredFieldsLength = Object.keys(this.fields).length;
    if (entryFieldsLength < requiredFieldsLength) {
      throw new CustomError(400, "failure", `Missing entry fields, must provide: ${Object.keys(this.fields).join(", ")}.`);
    }
    if (entryFieldsLength > requiredFieldsLength) {
      throw new CustomError(400, "failure", `Too many entry fields, must provide: ${Object.keys(this.fields).join(", ")}.`);
    }
    for (const entryKey in entry) {
      let requiredKey = this.fields[entryKey];
      if (requiredKey.type === "number") {
        const { errMsg, number } = validateNumber(entry[entryKey], requiredKey.min ?? null, requiredKey.max ?? null);
        if (errMsg) {
          throw new CustomError(400, "failure", `Entry must have a field ${entryKey}, ${errMsg}`);
        }
        entry[entryKey] = number;
      }
      if (requiredKey.type === "string") {
        const { errMsg, string } = validateString(entry[entryKey], requiredKey.minLen ?? null, requiredKey.maxLen ?? null);
        if (errMsg) {
          throw new CustomError(400, "failure", `Entry must have a field ${entryKey}, ${errMsg}`);
        }
        entry[entryKey] = string;
      }
    }
    return entry;
  }
}
export default _BaseModel;
