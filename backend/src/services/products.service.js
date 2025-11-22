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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var ProductService = /** @class */ (function () {
    function ProductService() {
    }
    ProductService.prototype.getAllProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var products, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.product.findMany({
                                include: {
                                    attributes: true,
                                    category: true,
                                    images: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 10
                            })];
                    case 1:
                        products = _a.sent();
                        return [2 /*return*/, products];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error al obtener los productos:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductService.prototype.createProduct = function (productData) {
        return __awaiter(this, void 0, void 0, function () {
            var productInput, newProduct, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        productInput = __assign(__assign(__assign({ sku: productData.sku, name: productData.name, description: productData.description, price: productData.price, costPrice: productData.costPrice, slug: productData.slug, status: productData.status }, (productData.attributes && { attributes: productData.attributes })), (productData.images && { images: productData.images })), (productData.createdById && {
                            createdBy: { connect: { id: productData.createdById } }
                        }));
                        if (productData.categoryId)
                            productInput.category = { connect: { id: productData.categoryId } };
                        else if (productData.category)
                            productInput.category = productData.category;
                        return [4 /*yield*/, prisma.product.create({
                                data: productInput,
                                include: {
                                    attributes: true,
                                    category: true,
                                    images: true
                                }
                            })];
                    case 1:
                        newProduct = _a.sent();
                        return [2 /*return*/, newProduct];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error al crear el producto:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductService.prototype.updateProduct = function (id, productData) {
        return __awaiter(this, void 0, void 0, function () {
            var updateInput_1, updatedProduct, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        updateInput_1 = {
                            sku: productData.sku,
                            name: productData.name,
                            description: productData.description,
                            price: productData.price,
                            costPrice: productData.costPrice,
                            slug: productData.slug,
                            status: productData.status,
                        };
                        Object.keys(updateInput_1).forEach(function (key) {
                            if (updateInput_1[key] === undefined) {
                                delete updateInput_1[key];
                            }
                        });
                        if (!productData.attributes) return [3 /*break*/, 2];
                        // Primero eliminar los atributos actuales
                        return [4 /*yield*/, prisma.productAttribute.deleteMany({
                                where: { productId: id }
                            })];
                    case 1:
                        // Primero eliminar los atributos actuales
                        _a.sent();
                        updateInput_1.attributes = productData.attributes;
                        _a.label = 2;
                    case 2:
                        if (!productData.images) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.productImage.deleteMany({
                                where: { productId: id }
                            })];
                    case 3:
                        _a.sent();
                        updateInput_1.images = productData.images;
                        _a.label = 4;
                    case 4:
                        if (productData.categoryId) {
                            updateInput_1.category = { connect: { id: productData.categoryId } };
                        }
                        else if (productData.category) {
                            updateInput_1.category = productData.category;
                        }
                        return [4 /*yield*/, prisma.product.update({
                                where: { id: id },
                                data: updateInput_1,
                                include: {
                                    attributes: true,
                                    category: true,
                                    images: true
                                }
                            })];
                    case 5:
                        updatedProduct = _a.sent();
                        return [2 /*return*/, updatedProduct];
                    case 6:
                        error_3 = _a.sent();
                        console.error('Error al actualizar el producto:', error_3);
                        throw error_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProductService.prototype.deleteProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, prisma.productAttribute.deleteMany({
                                where: {
                                    productId: id
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, prisma.productImage.deleteMany({
                                where: {
                                    productId: id
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma.product.delete({
                                where: { id: id },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, "Producto eliminado exitosamente"];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error al eliminar el producto:', error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductService.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var product, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.product.findUnique({
                                where: { id: id },
                                include: {
                                    attributes: true,
                                    category: true,
                                    images: true
                                }
                            })];
                    case 1:
                        product = _a.sent();
                        if (!product) {
                            throw new Error("Producto con ID ".concat(id, " no encontrado"));
                        }
                        return [2 /*return*/, product];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Error al obtener el producto con ID ".concat(id, ":"), error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProductService;
}());
exports.ProductService = ProductService;
