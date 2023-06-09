export const wrongRequestType = (req, res, next) => {
  if (req.method !== "GET") {
    if (!req.headers["content-type"]?.includes("application/json") && req.headers["content-type"] !== "application/x-www-form-urlencoded") {
      return res.status(400).json({ type: "failure", message: "Invalid request content/type. Use only application/json OR application/x-www-form-urlencoded requests." });
    }
  }
  return next();
};
