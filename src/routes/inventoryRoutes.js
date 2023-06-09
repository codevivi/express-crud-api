import express from "express";
const router = express.Router();
import { getAll, getById } from "../controllers/inventoryController.js";

router.get("", getAll);
router.get("/:id", getById);

const inventoryRoutes = router;
export default inventoryRoutes;
