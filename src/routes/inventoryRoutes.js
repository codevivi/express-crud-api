import express from "express";
const router = express.Router();
import { getAll, getById } from "../controllers/inventoryController.js";

router.get("", getAll);
router.get("/:id", getById);

export const inventoryRoutes = router;
