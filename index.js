import express, { urlencoded } from "express";
import { PORT } from "./src/config.js";
console.log(PORT);

const api = express();

api.use(urlencoded({ extended: false }));
api.use(express.json());

api.listen(PORT, () => {
  console.log(`express api is running on port ${PORT}`);
});
