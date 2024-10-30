export default function errorHandlerMiddleware(error, req, res, next) {
  console.log("error:", error);
  next();
}
