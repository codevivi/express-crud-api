import express from "express";
import awaitErrorCatcher from "../utils/awaitErrorCatcher.js";
const router = express.Router();
import { addItem } from "../controllers/inventoryController.js";

router.post("", awaitErrorCatcher(addItem));

const itemRoutes = router;

export default itemRoutes;
