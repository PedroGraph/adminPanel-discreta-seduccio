"use strict";
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
exports.seedInventory = seedInventory;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function seedInventory() {
    return __awaiter(this, void 0, void 0, function () {
        var inventory, _i, inventory_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inventory = [
                        {
                            productId: 1, // Vestido Negro Elegante
                            warehouseId: 1, // Almacén Principal
                            quantity: 100,
                            availableQuantity: 100,
                            reservedQuantity: 0,
                            thresholdQuantity: 20,
                            location: 'A-1-1',
                        },
                        {
                            productId: 2, // Zapatos de Tacón Alto
                            warehouseId: 1, // Almacén Principal
                            quantity: 50,
                            availableQuantity: 50,
                            reservedQuantity: 0,
                            thresholdQuantity: 10,
                            location: 'B-2-1',
                        },
                        {
                            productId: 1, // Vestido Negro Elegante
                            warehouseId: 2, // Almacén Norte
                            quantity: 75,
                            availableQuantity: 75,
                            reservedQuantity: 0,
                            thresholdQuantity: 15,
                            location: 'A-1-1',
                        },
                        {
                            productId: 2, // Zapatos de Tacón Alto
                            warehouseId: 2, // Almacén Norte
                            quantity: 25,
                            availableQuantity: 25,
                            reservedQuantity: 0,
                            thresholdQuantity: 5,
                            location: 'B-2-1',
                        },
                    ];
                    _i = 0, inventory_1 = inventory;
                    _a.label = 1;
                case 1:
                    if (!(_i < inventory_1.length)) return [3 /*break*/, 4];
                    item = inventory_1[_i];
                    return [4 /*yield*/, prisma.inventory.upsert({
                            where: {
                                productId_warehouseId: {
                                    productId: item.productId,
                                    warehouseId: item.warehouseId,
                                },
                            },
                            update: item,
                            create: item,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('✅ Inventario sembrado exitosamente');
                    return [2 /*return*/];
            }
        });
    });
}
