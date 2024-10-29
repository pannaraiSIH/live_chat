const errorHandlerMiddleware = async (error, req, res, next) => {
  console.log("error:", error);
  next();
};

export default errorHandlerMiddleware;
