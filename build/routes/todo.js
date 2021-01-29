"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
var express_1 = __importDefault(require("express"));
var lodash_1 = require("lodash");
var fs_1 = __importDefault(require("fs"));
var multer_1 = __importDefault(require("multer"));
// @ts-ignore
var convert_excel_to_json_1 = __importDefault(require("convert-excel-to-json"));
var verifyToken_1 = require("../util/verifyToken");
var todo_1 = require("../models/todo");
var upload = multer_1.default({ dest: "uploads/" });
exports.todoRouter = express_1.default.Router();
exports.todoRouter.use(verifyToken_1.verifyJWT);
exports.todoRouter.get("/api/todo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, todos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                return [4 /*yield*/, todo_1.Todo.find({ userId: userId })];
            case 1:
                todos = _a.sent();
                res.status(200).json(todos);
                return [2 /*return*/];
        }
    });
}); });
exports.todoRouter.delete("/api/todo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, nome, deleteTodo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, nome = _a.nome;
                return [4 /*yield*/, todo_1.Todo.deleteOne({ userId: userId, nome: nome })];
            case 1:
                deleteTodo = _b.sent();
                if (deleteTodo.deletedCount === 0) {
                    res.status(404).json({ message: "Tarefa não encontrada" });
                    return [2 /*return*/];
                }
                res.status(200).json(__assign(__assign({}, deleteTodo), { message: "Tarefa deletada" }));
                return [2 /*return*/];
        }
    });
}); });
exports.todoRouter.post("/api/todo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, nome, data, hora, status, existeTodo, _b, date, newTodo, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, userId = _a.userId, nome = _a.nome, data = _a.data, hora = _a.hora, status = _a.status;
                _b = Boolean;
                return [4 /*yield*/, todo_1.Todo.find({ userId: userId, nome: nome })];
            case 1:
                existeTodo = _b.apply(void 0, [_c.sent()]);
                if (existeTodo) {
                    res.status(200).json({ message: "Tarefa já existente em nosso sistema" });
                    return [2 /*return*/];
                }
                date = new Date(data);
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                newTodo = todo_1.Todo.build({
                    userId: userId,
                    nome: nome,
                    data: date,
                    hora: hora,
                    status: status || null,
                });
                return [4 /*yield*/, newTodo.save()];
            case 3:
                _c.sent();
                res.status(200).json(newTodo);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _c.sent();
                res.status(400).json(e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.todoRouter.post("/api/todo/bulk", upload.single("tabela"), verifyToken_1.verifyJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, file, data, cabecalho, nomeColumn, dataColumn, horaColumn, statusColumn;
    return __generator(this, function (_a) {
        userId = req.body.userId;
        file = convert_excel_to_json_1.default({ sourceFile: "./uploads/" + req.file.filename });
        data = file[Object.keys(file)[0]];
        cabecalho = data.shift();
        nomeColumn = "";
        dataColumn = "";
        horaColumn = "";
        statusColumn = "";
        lodash_1.forEach(cabecalho, function (columnName, key) {
            if (columnName.toLowerCase() === "nome") {
                nomeColumn = key;
            }
            else if (columnName.toLowerCase() === "data") {
                dataColumn = key;
            }
            else if (columnName.toLowerCase() === "hora") {
                horaColumn = key;
            }
            else if (columnName.toLowerCase() === "status") {
                statusColumn = key;
            }
        });
        if (!nomeColumn || !dataColumn || !horaColumn) {
            res.status(400).json({
                message: "Está faltando dados na sua tabela, confira se há todas as colunas necessárias",
            });
        }
        lodash_1.forEach(data, function (line, index) { return __awaiter(void 0, void 0, void 0, function () {
            var nome, date, hora, status, existeTodo, _a, newTodo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nome = line[nomeColumn];
                        date = new Date(line[dataColumn]);
                        hora = line[horaColumn];
                        status = line[statusColumn] || null;
                        if (!nome || !date || !hora) {
                            res.status(400).json({
                                message: "Est\u00E1 faltando dados na sua tabela na linha " + (index + 1) + ", confira se h\u00E1 todos os dados necess\u00E1rios nela",
                            });
                        }
                        _a = Boolean;
                        return [4 /*yield*/, todo_1.Todo.find({ userId: userId, nome: nome })];
                    case 1:
                        existeTodo = _a.apply(void 0, [_b.sent()]);
                        if (existeTodo) {
                            res
                                .status(200)
                                .json({ message: "Tarefa já existente em nosso sistema" });
                            return [2 /*return*/];
                        }
                        newTodo = todo_1.Todo.build({
                            userId: userId,
                            nome: nome,
                            data: date,
                            hora: hora,
                            status: status,
                        });
                        return [4 /*yield*/, newTodo.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        fs_1.default.unlinkSync("./uploads/" + req.file.filename);
        res.status(200).json({ message: "Upload realizado com sucesso" });
        return [2 /*return*/];
    });
}); });
