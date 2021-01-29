"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app_1 = require("../app");
var verifyJWT = function (req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ auth: false, message: "No token provided." });
    jsonwebtoken_1.default.verify(token, app_1.notSoSecret, function (err, decoded) {
        if (err) {
            return res
                .status(500)
                .json({ auth: false, message: "Failed to authenticate token." });
        }
        req.body.userId = decoded.id;
        next();
    });
};
exports.verifyJWT = verifyJWT;
