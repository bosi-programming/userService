import express from "express";
import bodyParser from "body-parser";

import { loginRouter } from "./routes/login";
import userRouter from "./routes/user";

import { connectToDataBase } from "./mongoConnection";

export const notSoSecret = "banana";

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(bodyParser.json());

app.use(loginRouter);
app.use(userRouter);

export const server = app.listen(port, () => {
  console.log("Listening on port:" + port);
});


export default app;
