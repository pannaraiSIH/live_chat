import express from "express";
const router = express.Router();

router.get("/", (req, rest) => {
  //   console.log("io", req.io);
  return rest.send("welcome to chat room");
});

export default router;
