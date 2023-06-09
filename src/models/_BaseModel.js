import { writeFile, readdir, readFile } from "node:fs/promises";
import { DB_BASE_PATH } from "../config.js";
import { validateString, validateNumber } from "./helpers/validators.js";
import makeSureIsFolder from "./helpers/makeSureIsFolder.js";
import initIdsGenerator from "./helpers/initIdsGenerator.js";

class _BaseModel {
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
    data = this.validateInsertData(data);
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
      return entry;
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
      if (!requiredKey) {
        throw { name: "dbError", message: `Invalid entry field: ${entryKey}` };
      }
      if (requiredKey.type === "number") {
        const { errMsg, number } = validateNumber(entry[entryKey], requiredKey.min ?? null, requiredKey.max ?? null);
        if (errMsg) {
          throw { name: "dbError", message: `Invalid entry field ${entryKey}  ${errMsg}` };
        }
        entry[entryKey] = number;
      }
      if (requiredKey.type === "string") {
        const { errMsg, string } = validateString(entry[entryKey], requiredKey.minLen ?? null, requiredKey.maxLen ?? null);
        if (errMsg) {
          throw { name: "dbError", message: `Invalid entry field ${entryKey}  ${errMsg}` };
        }
        entry[entryKey] = string;
      }
    }
    return entry;
  }
}
export default _BaseModel;
