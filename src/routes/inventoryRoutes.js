import express from "express";
const router = express.Router();
import awaitErrorCatcher from "../utils/awaitErrorCatcher.js";
import { getAll, getById } from "../controllers/inventoryController.js";

router.get("", awaitErrorCatcher(getAll));
router.get("/:id", awaitErrorCatcher(getById));

const inventoryRoutes = router;
export default inventoryRoutes;
