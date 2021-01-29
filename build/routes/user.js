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
exports.userRouter = void 0;
var express_1 = __importDefault(require("express"));
var encryption_1 = require("../util/encryption");
var testCPF_1 = require("../util/testCPF");
var verifyToken_1 = require("../util/verifyToken");
var user_1 = require("../models/user");
var todo_1 = require("../models/todo");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/api/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cpf, email, telefone, senha, hashedSenha, newUser, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, cpf = _a.cpf, email = _a.email, telefone = _a.telefone, senha = _a.senha;
                if (!testCPF_1.testCPF(cpf.replace(/[^\w\s]/gi, ''))) {
                    res.status(400).json("CPF com erro");
                    return [2 /*return*/];
                }
                else if (!/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/.test(telefone)) {
                    res.status(400).json("Telefone com erro");
                    return [2 /*return*/];
                }
                else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                    res.status(400).json("Email com erro");
                    return [2 /*return*/];
                }
                hashedSenha = encryption_1.encrypt(senha);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                newUser = user_1.User.build({ cpf: cpf, email: email, telefone: telefone, senha: hashedSenha });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _b.sent();
                res.status(200).json(newUser);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                res.status(400).json(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.delete("/api/users", verifyToken_1.verifyJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, email, deleteUser, deleteAllTodo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, email = _a.email;
                return [4 /*yield*/, user_1.User.deleteOne({ userId: userId, email: email })];
            case 1:
                deleteUser = _b.sent();
                if (deleteUser.deletedCount === 0) {
                    res.status(400).json({ message: "Usuário não existe em nosso sistema" });
                }
                else {
                    deleteAllTodo = todo_1.Todo.deleteMany({ userId: userId });
                    res.status(200).json(__assign(__assign(__assign({}, deleteUser), deleteAllTodo), { message: "Usuário deletado do sistema" }));
                }
                return [2 /*return*/];
        }
    });
}); });
