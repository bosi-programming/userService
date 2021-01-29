"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDataBase = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var url = "mongodb+srv://userBosi:ryfAwtPiPoxstV8t@cluster0.wqqph.mongodb.net/test?retryWrites=true&w=majority";
var connectToDataBase = function () {
    mongoose_1.default.connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, function () {
        console.log("connect to database");
    });
};
exports.connectToDataBase = connectToDataBase;
