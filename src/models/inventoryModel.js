//example entry {codeName: 'box-outer-123', description: 'double wall brown carton box 345mm x 500mm'}
import _BaseModel from "./_BaseModel.js";

///must have allowedChars if creating trie from it (need to refactor somehow to make it more clear);
const fields = {
  codeName: {
    type: "string",
    maxLen: 50,
    minLen: 2,
    allowedChars: { description: 'only english lowercase letters, digits, "-", and space', chars: [" ", "-", "z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"] },
  },
  description: { type: "string", maxLen: 500 },
};

class InventoryModel extends _BaseModel {
  constructor(folderName, fields, fieldToIndexedTrie = "codeName") {
    super(folderName, fields, fieldToIndexedTrie);
  }
}

const inventoryModel = new InventoryModel("inventory", fields);

export default inventoryModel;
