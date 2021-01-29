import express from "express";

import { encrypt } from "../util/encryption";
import { testCPF } from "../util/testCPF";
import { verifyJWT } from "../util/verifyToken";

import { User } from "../models/user";
import { Todo } from "../models/todo";

export const userRouter = express.Router();

userRouter.post("/api/users", async (req, res) => {
  const { cpf, email, telefone, senha } = req.body;

  if (!testCPF(cpf)) {
    res.status(400).json("CPF com erro");
    return;
  } else if (!/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/.test(telefone)) {
    res.status(400).json("Telefone com erro");
    return;
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    res.status(400).json("Email com erro");
    return;
  }

  const hashedSenha = encrypt(senha);

  try {
    const newUser = User.build({ cpf, email, telefone, senha: hashedSenha });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.delete("/api/users", verifyJWT, async (req, res) => {
  const { userId, email } = req.body;

  const deleteUser = await User.deleteOne({ userId, email });

  if(deleteUser.deletedCount === 0) {
    res.status(400).json({ message: "Usuário não existe em nosso sistema"});
  } else {
    const deleteAllTodo = Todo.deleteMany({ userId });
    res.status(200).json({ ...deleteUser, ...deleteAllTodo, message: "Usuário deletado do sistema" });
  }
});
