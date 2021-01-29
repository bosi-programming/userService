import express from "express";
import { forEach } from "lodash";
import fs from "fs";
import multer from "multer";
// @ts-ignore
import excelToJson from "convert-excel-to-json";

import { verifyJWT } from "../util/verifyToken";
import { Todo } from "../models/todo";

const upload = multer({ dest: "uploads/" });

export const todoRouter = express.Router();

todoRouter.use(verifyJWT);

todoRouter.get("/api/todo", async (req, res) => {
  const { userId } = req.body;
  const todos = await Todo.find({ userId });
  res.status(200).json(todos);
});

todoRouter.delete("/api/todo", async (req, res) => {
  const { userId, nome } = req.body;
  const deleteTodo = await Todo.deleteOne({ userId, nome });

  if (deleteTodo.deletedCount === 0) {
    res.status(404).json({ message: "Tarefa não encontrada" });
  } else {
    res.status(200).json({ ...deleteTodo, message: "Tarefa deletada" });
  }
});

todoRouter.post("/api/todo", async (req, res) => {
  const { userId, nome, data, hora, status } = req.body;

  const existeTodo = Boolean(await Todo.find({ userId, nome }));

  if (existeTodo) {
    res.status(200).json({ message: "Tarefa já existente em nosso sistema" });
    return;
  }

  const date = new Date(data);

  try {
    const newTodo = Todo.build({
      userId,
      nome,
      data: date,
      hora,
      status: status || null,
    });
    await newTodo.save();
    res.status(200).json(newTodo);
  } catch (e) {
    res.status(400).json(e);
  }
});

todoRouter.post(
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
      res.status(400).json({
        message:
          "Está faltando dados na sua tabela, confira se há todas as colunas necessárias",
      });
    }

    forEach(data, async (line: any, index: number) => {
      const nome = line[nomeColumn];
      const date = new Date(line[dataColumn]);
      const hora = line[horaColumn];
      const status = line[statusColumn] || null;

      if (!nome || !date || !hora) {
        res.status(400).json({
          message: `Está faltando dados na sua tabela na linha ${
            index + 1
          }, confira se há todos os dados necessários nela`,
        });
      }

      const existeTodo = Boolean(await Todo.find({ userId, nome }));

      if (existeTodo) {
        res
          .status(200)
          .json({ message: "Tarefa já existente em nosso sistema" });
        return;
      }
      const newTodo = Todo.build({
        userId,
        nome,
        data: date,
        hora,
        status,
      });
      await newTodo.save();
    });

    fs.unlinkSync(`./uploads/${req.file.filename}`);
    res.status(200).json({ message: "Upload realizado com sucesso" });
  }
);
