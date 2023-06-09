const wrongEndPoint = (req, res, next) => {
  res.status(404).json({
    type: "failure",
    message: "Endpoint not found",
  });
};

export default wrongEndPoint;
