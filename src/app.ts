import express from "express";
import { forEach } from "lodash";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
// @ts-ignore
import excelToJson from "convert-excel-to-json";

import { encrypt, decrypt } from "./util/encryption";
import { testCPF } from "./util/testCPF";
import { verifyJWT } from "./util/verifyToken";

import { connectToDataBase } from "./mongoConnection";

import { Todo } from "./models/todo";
import { User } from "./models/user";

export const notSoSecret = "banana";

const app: express.Application = express();
const port = 3000;
connectToDataBase();
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());

app.post("/api/login", async (req, res) => {
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

app.get("/api/todo", verifyJWT, (req, res) => {
  const { userId } = req.body;
  const todos = Todo.find({ userId });
  res.status(200).json(todos);
});
app.post("/api/todo", verifyJWT, async (req, res) => {
  const { userId, nome, data, hora, status } = req.body;

  const date = new Date(data);

  try {
    const newTodo = Todo.build({ userId, nome, data: date, hora, status });
    await newTodo.save();
    res.status(200).json(newTodo);
  } catch (e) {
    res.status(400).json(e);
  }
});
app.post(
  "/api/todo/bulk",
  upload.single("tabela"),
  verifyJWT,
  async (req, res) => {
    const { userId } = req.body;
    const file = excelToJson({ sourceFile: `./uploads/${req.file.filename}` });

    const data = file[Object.keys(file)[0]];
    const cabecalho = data.shift();

    let nomeColumn: string = "";
    let dataColumn: string = "";
    let horaColumn: string = "";
    let statusColumn: string = "";

    forEach(cabecalho, (columnName: string, key: string) => {
      if (columnName.toLowerCase() === "nome") {
        nomeColumn = key;
      } else if (columnName.toLowerCase() === "data") {
        dataColumn = key;
      } else if (columnName.toLowerCase() === "hora") {
        horaColumn = key;
      } else if (columnName.toLowerCase() === "status") {
        statusColumn = key;
      }
    });

    if (!nomeColumn || !dataColumn || !horaColumn) {
      res
        .status(400)
        .json({
          message:
            "Está faltando dados na sua tabela, confira se há todas as colunas necessárias",
        });
    }

    forEach(data, async (line: any) => {
      const date = new Date(line[dataColumn]);
      const newTodo = Todo.build({
        userId,
        nome: line[nomeColumn],
        data: date,
        hora: line[horaColumn],
        status: line[statusColumn],
      });
      await newTodo.save();
    });

    fs.unlinkSync(`./uploads/${req.file.filename}`);
    res.status(200).send();
  }
);

app.listen(port, () => {
  console.log("Listening on port:" + port);
});
