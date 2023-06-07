import env from "dotenv";
env.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_BASE_PATH = new URL("./../db/", import.meta.url).pathname;
