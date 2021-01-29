import express from "express";
import bodyParser from "body-parser";

import { loginRouter } from './routes/login';
import { todoRouter } from './routes/todo';
import { userRouter } from './routes/user';

import { connectToDataBase } from "./mongoConnection";

export const notSoSecret = "banana";

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(bodyParser.json());

app.use(loginRouter);
app.use(todoRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log("Listening on port:" + port);
});
