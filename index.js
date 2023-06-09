import express from "express";
import { PORT } from "./src/config.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import errorOnWrongRequestType from "./src/middlewares/errorOnWrongRequestType.js";
import errorOnWrongEndPoint from "./src/middlewares/errorOnWrongEndPoint.js";
import errorResponder from "./src/middlewares/errorResponder.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorOnWrongRequestType);
app.use("/api/item", itemRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use(errorOnWrongEndPoint);
app.use(errorResponder);

app.listen(PORT, () => {
  console.log(`express inventory api is running on port ${PORT}`);
});
