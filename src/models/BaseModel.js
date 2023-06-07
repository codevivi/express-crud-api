import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import { DB_BASE_PATH } from "../config.js";
import { v4 as uid } from "uuid";

const makeSureIsFolder = async (path) => {
  try {
    await mkdir(path);
    return true;
  } catch (e) {
    if (e.code == "EEXIST") {
      return true;
    }
    throw new Error("could not create folder");
  }
};

class BaseModel {
  //if fields left default false, means all entries allowed and not validated;
  constructor(folderName, fields = false) {
    this.folder = `${DB_BASE_PATH}/${folderName}`;
    this.fields = fields;
  }

  async add(data) {
    this.validateData(data);
    await makeSureIsFolder(this.folder);
    data.id = uid();
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

  validateData(entry) {
    if (!this.fields) {
      return true;
    }

    console.log(entry);
    let error = false;
    for (const key in entry) {
      const existing = this.fields[key];
      if (!existing) {
        error = true;
        break;
      }
      if (existing.type !== typeof entry[key] || (existing.type === "number" && !isNaN(typeof entry[key]))) {
        error = true;
        break;
      }
      if (existing.maxLen && entry[key].length > existing.maxLen) {
        error = true;
        break;
      }
      if (existing.max && entry[key] > existing.max) {
        error = true;
        break;
      }
    }
    if (error) {
      throw { name: "dbError", message: "invalid database fields" };
    }
    return true;
  }
}
export default BaseModel;
