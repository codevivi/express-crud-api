import { inventoryModel } from "../models/inventoryModel.js";

export const getAll = async (req, res, next) => {
  try {
    const items = await inventoryModel.getAll();
    res.status(200).json({ type: "success", message: "Got all inventory items", items: items });
  } catch (e) {
    res.status(500).json({ type: "error", message: "Server Error" });
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await inventoryModel.getById(req.params.id);
    res.status(200).json({ type: "success", message: "Got item by id", item: item });
  } catch (e) {
    if (e.code === "ENOENT") {
      return res.status(404).json({ type: "failure", message: "Inventory item with this id not found" });
    }
    res.status(500).json({ type: "error", message: "Server Error" });
  }
};

export const addItem = async (req, res, next) => {
  try {
    const id = await inventoryModel.add(req.body);
    res.status(201).json({ type: "success", message: "Added Item to Inventory", id: id });
  } catch (e) {
    console.log(e);
    if (e.name === "dbError") {
      return res.status(400).json({ type: "failure", message: e.message });
    }
    res.status(500).json({ type: "error", message: "Server Error" });
  }
};
