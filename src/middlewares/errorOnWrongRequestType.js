import CustomError from "../utils/CustomError.js";

const errorOnWrongRequestType = (req, res, next) => {
  if (req.method !== "GET") {
    if (!req.headers["content-type"]?.includes("application/json") && req.headers["content-type"] !== "application/x-www-form-urlencoded") {
      throw new CustomError(400, "failure", "Invalid request content/type. Use only application/json OR application/x-www-form-urlencoded requests.");
    }
  }
  return next();
};

export default errorOnWrongRequestType;
