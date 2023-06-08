//example entry {codeName: 'box-outer-123', description: 'double wall brown carton box 345mm x 500mm', units: 200}
import BaseModel from "./BaseModel.js";

const fields = {
  codeName: { type: "string", maxLen: 50 },
  description: { type: "string", maxLen: 200 },
  units: { type: "number", max: 1000000 },
};

class InventoryModel extends BaseModel {
  constructor(folderName, fields) {
    super(folderName, fields);
  }
}

const inventoryModel = new InventoryModel("inventory", fields);

export { inventoryModel };
