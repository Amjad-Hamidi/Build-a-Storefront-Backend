import express, { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../middleware/auth";

const userModel = new UserModel();
const router = express.Router();
const { JWT_SECRET } = process.env;

router.get("/", verifyAuthToken, async (_req: Request, res: Response) => {
  const users = await userModel.index();
  res.json(users);
});

router.get("/:id", verifyAuthToken, async (req: Request, res: Response) => {
  const user = await userModel.show(parseInt(req.params.id));
  res.json(user);
});


router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await userModel.create(req.body);
    const token = jwt.sign({ user }, JWT_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await userModel.authenticate(req.body.firstname, req.body.password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ user }, JWT_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
