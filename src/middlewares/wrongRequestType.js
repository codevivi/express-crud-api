export const wrongRequestType = (req, res, next) => {
  if (req.method !== "GET" && !req.headers["content-type"]?.includes("application/json")) {
    return res.status(400).json({ type: "failure", message: "Invalid request content/type. Use only application/json requests." });
  }
  return next();
};
