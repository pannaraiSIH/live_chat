import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.signedCookies.accessTokenCookie;
    if (!token) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    next();
  } catch (error) {
    console.error("error:", error);
  }
}
