import jwt from "jsonwebtoken";
import Agent from "../models/Agent.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.agent = await Agent.findById(decoded.id).select("-password");

      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};