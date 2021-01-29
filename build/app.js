"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notSoSecret = void 0;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var login_1 = require("./routes/login");
var todo_1 = require("./routes/todo");
var mongoConnection_1 = require("./mongoConnection");
exports.notSoSecret = "banana";
var app = express_1.default();
var port = 3000;
mongoConnection_1.connectToDataBase();
app.use(body_parser_1.default.json());
app.use(login_1.loginRouter);
app.use(todo_1.todoRouter);
app.listen(port, function () {
    console.log("Listening on port:" + port);
});
