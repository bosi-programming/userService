"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var status;
(function (status) {
    status[status["naoIniciado"] = 0] = "naoIniciado";
    status[status["emProgresso"] = 1] = "emProgresso";
    status[status["completo"] = 2] = "completo";
})(status || (status = {}));
var todoSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['naoIniciado', 'emProgresso', 'completo'],
        required: false
    }
});
todoSchema.statics.build = function (attr) {
    return new exports.Todo(attr);
};
exports.Todo = mongoose_1.default.model('Todo', todoSchema);
