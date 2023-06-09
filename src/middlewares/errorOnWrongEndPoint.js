import CustomError from "../utils/CustomError.js";
const errorOnWrongEndPoint = (req, res, next) => {
  throw new CustomError(404, "failure", "Endpoint not found");
};

export default errorOnWrongEndPoint;
