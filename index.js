import express from "express";
import { PORT } from "./src/config.js";
import errorOnWrongRequestType from "./src/middlewares/errorOnWrongRequestType.js";
import errorOnWrongEndPoint from "./src/middlewares/errorOnWrongEndPoint.js";
import errorResponder from "./src/middlewares/errorResponder.js";
import awaitErrorCatcher from "./src/utils/awaitErrorCatcher.js";
import { getInventoryPage, addItemToInventory, getInventory } from "./src/controllers/inventoryController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorOnWrongRequestType);

app.post("/api/item", awaitErrorCatcher(addItemToInventory));
app.get("/api/inventory/:id?", awaitErrorCatcher(getInventory));
app.get("/api/inventory-page/:page?/:size?", awaitErrorCatcher(getInventoryPage));

app.use(errorOnWrongEndPoint);
app.use(errorResponder);

app.listen(PORT, () => {
  console.log(`express inventory api is running on port ${PORT}`);
});
