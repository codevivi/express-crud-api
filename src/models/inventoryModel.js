//example entry {codeName: 'box-outer-123', description: 'double wall brown carton box 345mm x 500mm'}
import _BaseModel from "./_BaseModel.js";

const fields = {
  codeName: { type: "string", maxLen: 50, minLen: 2 },
  description: { type: "string", maxLen: 500 },
};

class InventoryModel extends _BaseModel {
  constructor(folderName, fields) {
    super(folderName, fields);
  }
}

const inventoryModel = new InventoryModel("inventory", fields);

export default inventoryModel;
