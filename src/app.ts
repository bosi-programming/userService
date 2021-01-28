import express, {Request} from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import { encrypt, decrypt } from "./util/encryption";
import { testCPF } from "./util/testCPF";
import { verifyJWT } from "./util/verifyToken";

import { connectToDataBase } from "./mongoConnection";

import { Todo } from "./models/todo";
import { User } from "./models/user";

interface RequestCustom extends Request {
  userId?: string
}

export const notSoSecret = "banana";

const app: express.Application = express();
const port = 3000;
connectToDataBase();

app.use(bodyParser.json());

app.post("/api/login", async (req, res, next) => {
  const { email, senha } = req.body;

  const user = await User.find({ email });

  if (!user) {
    res.status(400).json("Usuário não encontrado");
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

  console.log(user);
  res.status(200).json({ token });
});
app.post("/api/logout", function (_, res) {
  res.json({ token: null });
});

app.post("/api/users", async (req, res) => {
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

app.get("/api/todo", verifyJWT, (req: RequestCustom, res) => {
  console.log(req.userId);
  res.json("Hello World!");
});
app.post("/api/todo", async (req, res) => {
  const { nome, timeStamp } = req.body;

  const data = new Date(timeStamp * 1000);
  data.setHours(23, 59, 59, 999);

  const hora = data.toLocaleTimeString();
  try {
    const newTodo = Todo.build({ userEmail: "test", nome, data, hora });
    await newTodo.save();
    res.status(200).json(newTodo);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.listen(port, () => {
  console.log("Listening on port:" + port);
});
