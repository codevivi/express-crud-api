import express from "express";
const router = express.Router();
import { addItem } from "../controllers/inventoryController.js";

router.post("", addItem);

const itemRoutes = router;

export default itemRoutes;
