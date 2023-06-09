import inventoryModel from "../models/inventoryModel.js";

export const getAll = async (req, res, next) => {
  const items = await inventoryModel.getAll();
  res.status(200).json({ type: "success", message: "Got all inventory items", items: items });
};

export const getById = async (req, res, next) => {
  const item = await inventoryModel.getById(req.params.id);
  res.status(200).json({ type: "success", message: "Got item by id", item: item });
};

export const addItem = async (req, res, next) => {
  let { description, codeName } = req.body;
  const id = await inventoryModel.add({ description, codeName });
  res.status(201).json({ type: "success", message: "Added Item to Inventory", id: id });
};
