import express from "express";
import jwt from "jsonwebtoken";

import {notSoSecret} from '../app';
import { decrypt } from "../util/encryption";

import { User } from "../models/user";

export const loginRouter = express.Router();

loginRouter.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.find({ email });

  if (!user) {
    res.status(400).json("Usuário não encontrado");
    return;
  }
  if (!senha) {
    res.status(400).json("Favor escrever sua senha");
    return;
  }

  const senhaDoBancoDecrypt = decrypt(user[0].senha);

  if (senha !== senhaDoBancoDecrypt) {
    res.status(400).json("Senha errada");
    return;
  }

  const userId = user[0]._id;
  const token = jwt.sign({ id: userId }, notSoSecret, {
    expiresIn: 3000,
  });

  res.status(200).json({ token });
});
