import env from "dotenv";
env.config();

export const PORT = parseInt(process.env.PORT);
export const NODE_ENV = process.env.NODE_ENV;
export const DB_BASE_PATH = new URL("./../db/", import.meta.url).pathname;
export const DEFAULT_ITEMS_PER_PAGE = parseInt(process.env.DEFAULT_ITEMS_PER_PAGE);
export const MIN_ITEMS_PER_PAGE = parseInt(process.env.MIN_ITEMS_PER_PAGE);
export const MAX_ITEMS_PER_PAGE = parseInt(process.env.MAX_ITEMS_PER_PAGE);
export const CHANGE_PER_PAGE_BY_INPUT = process.env.CHANGE_PER_PAGE_BY_INPUT === "true" ? true : false;
