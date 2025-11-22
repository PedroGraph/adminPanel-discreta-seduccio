"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var products_routes_js_1 = require("./products.routes.js");
var auth_routes_js_1 = require("./auth.routes.js");
var router = (0, express_1.Router)();
router.use('/products', products_routes_js_1.default);
router.use('/auth', auth_routes_js_1.default);
exports.default = router;
