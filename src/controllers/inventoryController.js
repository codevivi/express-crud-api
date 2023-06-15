import inventoryModel from "../models/inventoryModel.js";
import { defaultItemsPerPage, minItemsPerPage, maxItemsPerPage } from "../utils/configsByInput.js";

export const getInventory = async (req, res, next) => {
  if (req?.params.id) {
    const item = await inventoryModel.getById(req.params.id);
    return res.status(200).json({ type: "success", message: "Got item by id", item: item });
  }
  const items = await inventoryModel.getAll();
  res.status(200).json({ type: "success", message: "Got all inventory items", items: items });
};

export const getInventoryPage = async (req, res, next) => {
  const page = req?.params.page || 1;
  const size = req?.params.size || defaultItemsPerPage;
  const items = [];
  res.status(200).json({ type: "success", message: `Got inventory page(${page}), items per page(${size})`, prev: "prevlink", items: items, next: "nextlink" });
};

export const addItemToInventory = async (req, res, next) => {
  let { description, codeName } = req.body;
  const id = await inventoryModel.add({ description, codeName });
  res.status(201).json({ type: "success", message: "Added Item to Inventory", id: id });
};
