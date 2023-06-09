import express from "express";
import { PORT } from "./src/config.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import wrongEndPoint from "./src/middlewares/wrongEndPoint.js";
import wrongRequestType from "./src/middlewares/wrongRequestType.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(wrongRequestType);
app.use("/api/item", itemRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use(wrongEndPoint);

app.listen(PORT, () => {
  console.log(`express inventory api is running on port ${PORT}`);
});
