import CustomError from "../utils/CustomError.js";
import { NODE_ENV } from "../config/config.js";
const errorResponder = (error, req, res, next) => {
  if (NODE_ENV === "development") {
    // for production could use some type of logger
    console.log(error);
  }

  if (error instanceof CustomError) {
    return res.status(error.code).json({
      type: error.type,
      message: error.message,
    });
  }
  if (error instanceof SyntaxError && error.type === "entity.parse.failed" && error.message.includes("JSON")) {
    return res.status(400).json({
      type: "failure",
      message: "Invalid JSON",
    });
  }
  res.status(500).json({
    type: "error",
    message: "Server Error",
  });
};

export default errorResponder;
