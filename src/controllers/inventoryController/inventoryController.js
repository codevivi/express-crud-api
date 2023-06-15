import inventoryModel from "../../models/inventoryModel.js";
import { validatePageReqParams } from "./validators.js";
import { REQ_BASE_URL } from "../../config.js";
import { defaultItemsPerPage } from "../../utils/configsByInput.js";

export const getInventory = async (req, res, next) => {
  if (req?.params.id) {
    const item = await inventoryModel.getById(req.params.id);
    return res.status(200).json({ type: "success", message: "Got item by id", item: item });
  }
  const items = await inventoryModel.getAll();
  res.status(200).json({ type: "success", message: "Got all inventory items", items: items });
};

export const getInventoryPage = async (req, res, next) => {
  const totalItemsCount = await inventoryModel.getCount();
  const [page, size] = validatePageReqParams(req, totalItemsCount);
  const prevPage = page - 1 > 0 ? page - 1 : "";
  const nextPage = totalItemsCount - page * size > 0 ? page + 1 : "";
  const prevUrl = prevPage ? `${REQ_BASE_URL}/inventory-page/${prevPage}${size !== defaultItemsPerPage ? "/" + size : ""}` : "";
  const nextUrl = nextPage ? `${REQ_BASE_URL}/inventory-page/${nextPage}${size !== defaultItemsPerPage ? "/" + size : ""}` : "";
  const items = [];

  res.status(200).json({ type: "success", message: `Got inventory page(${page}), items per page(${size})`, prev: prevUrl, items: items, next: nextUrl });
};

export const addItemToInventory = async (req, res, next) => {
  let { description, codeName } = req.body;
  const id = await inventoryModel.add({ description, codeName });
  res.status(201).json({ type: "success", message: "Added Item to Inventory", id: id });
};
