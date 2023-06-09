import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import { mkdirSync, readdirSync } from "node:fs";
import { DB_BASE_PATH } from "../config.js";

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

//this is base class, do not create object directly from it, use extends
class BaseModel {
  //if fields left default false, means all entries allowed and not validated;
  constructor(folderName, fields = false) {
    const folder = `${DB_BASE_PATH}/${folderName}`;
    this.folder = folder;
    makeSureIsFolder(folder);
    this.fields = fields;
    this._idGenerator = initIdsGenerator(folder);
    if (this.constructor.name === "BaseModel") {
      throw new Error("BaseModel class can only be extended");
    }
  }

  get newId() {
    return this._idGenerator.next().value;
  }

  async add(data) {
    this.validateInsertData(data);
    data.id = this.newId;
    data.creationTime = Date.now();
    const filePath = `${this.folder}/${data.id}.json`;
    let jsonData = JSON.stringify(data);
    await writeFile(filePath, jsonData);
    return data.id;
  }

  async getById(id) {
    const item = await readFile(`${this.folder}/${id}.json`, "utf-8");
    return JSON.parse(item);
  }

  async getAll() {
    const files = await readdir(this.folder);
    const dataArr = await Promise.all(files.map((file) => readFile(`${this.folder}/${file}`, "utf-8")));
    return dataArr.map((item) => JSON.parse(item));
  }

  validateInsertData(entry) {
    if (!this.fields) {
      return true;
    }
    const entryFieldsLength = Object.keys(entry).length;
    const requiredFieldsLength = Object.keys(this.fields).length;
    if (entryFieldsLength < requiredFieldsLength) {
      throw { name: "dbError", message: `Missing entry fields, must provide: ${Object.keys(this.fields).join(", ")}.` };
    }
    if (entryFieldsLength > requiredFieldsLength) {
      throw { name: "dbError", message: `Too many entry fields, must provide: ${Object.keys(this.fields).join(", ")}.` };
    }
    for (const entryKey in entry) {
      const requiredKey = this.fields[entryKey];
      const entryValue = entry[entryKey];
      if (!requiredKey) {
        throw { name: "dbError", message: `Invalid entry field: ${entryKey}` };
      }
      if (requiredKey.type !== typeof entryValue || (requiredKey.type === "number" && !isNaN(typeof entryValue))) {
        throw { name: "dbError", message: `Invalid entry field ${entryKey} value type, must be ${requiredKey.type}` };
      }
      if (requiredKey.maxLen && entryValue.length > requiredKey.maxLen) {
        throw { name: "dbError", message: `Invalid entry field ${entryKey} value length, must be ${requiredKey.maxLen}` };
      }
      if (requiredKey.minLen && entryValue.length < requiredKey.minLen) {
        throw { name: "dbError", message: `Invalid entry field: ${entryKey} value length, must be at least ${requiredKey.minLen}` };
      }
      if (requiredKey.max && entryValue > requiredKey.max) {
        throw { name: "dbError", message: `Invalid entry field ${entryKey} value, must be less than ${requiredKey.max}` };
      }
      if (requiredKey.min && entryValue > requiredKey.min) {
        throw { name: "dbError", message: `Invalid entry field ${entryKey} value, must be at least ${requiredKey.min}` };
      }
    }

    return true;
  }
}
export default BaseModel;
