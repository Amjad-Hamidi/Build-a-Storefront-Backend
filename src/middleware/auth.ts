import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw new Error("No token provided");
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET as string);
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default verifyAuthToken;