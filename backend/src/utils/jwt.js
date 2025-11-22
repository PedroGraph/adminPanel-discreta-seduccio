"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || '';
var JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h');
var generateToken = function (payload) {
    var options = {
        expiresIn: JWT_EXPIRES_IN,
    };
    if (JWT_SECRET === '') {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
var decodeToken = function (token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (error) {
        return null;
    }
};
exports.decodeToken = decodeToken;
