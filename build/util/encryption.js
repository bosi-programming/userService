"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
var masterKey = "banana";
var encrypt = function (senha) {
    var iv = crypto_1.default.randomBytes(16);
    var salt = crypto_1.default.randomBytes(64);
    var key = crypto_1.default.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");
    var cipher = crypto_1.default.createCipheriv("aes-256-gcm", key, iv);
    var encrypted = Buffer.concat([
        cipher.update(senha, "utf8"),
        cipher.final(),
    ]);
    var tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
};
exports.encrypt = encrypt;
var decrypt = function (encryptSenha) {
    var bData = Buffer.from(encryptSenha, "base64");
    var salt = bData.slice(0, 64);
    var iv = bData.slice(64, 80);
    var tag = bData.slice(80, 96);
    var text = bData.slice(96);
    var key = crypto_1.default.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");
    var decipher = crypto_1.default.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    // encrypt the given text
    var decrypted = 
    // @ts-ignore
    decipher.update(text, "binary", "utf8") + decipher.final("utf8");
    return decrypted;
};
exports.decrypt = decrypt;
