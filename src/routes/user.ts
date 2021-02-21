import express from "express";

import { encrypt } from "../util/encryption";
import { verifyJWT } from "../util/verifyToken";

import { User } from "../models/user";

const userRouter = express.Router();

userRouter.post("/api/users", async (req, res) => {
  const { userName, authorName, role, mainAccount, password } = req.body;

  const hashedPassword = encrypt(password);
  try {
    const newUser = User.build({ userName, authorName, role, mainAccount, password: hashedPassword });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.delete("/api/users", verifyJWT, async (req, res) => {
  const { userId, userName } = req.body;

  const deleteUser = await User.deleteOne({ _id: userId, userName });

  if(deleteUser.deletedCount === 0) {
    res.status(400).json({ message: "Usuário não existe em nosso sistema"});
  } else {
    res.status(200).json({ ...deleteUser, message: "Usuário deletado do sistema" });
  }
});

export default userRouter;
