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
exports.seedSuppliers = seedSuppliers;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function seedSuppliers() {
    return __awaiter(this, void 0, void 0, function () {
        var suppliers, _i, suppliers_1, supplier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    suppliers = [
                        {
                            name: 'Proveedor Textil A',
                            contactPerson: 'Ana Martínez',
                            email: 'ana.martinez@proveedor-a.com',
                            phone: '5555555556',
                            address: 'Av. Insurgentes 123, Col. Del Valle',
                            taxId: 'XAXX010101000',
                            paymentTerms: 'Net 30',
                            leadTime: '15 días',
                            reliability: 'High',
                            status: 'active',
                        },
                        {
                            name: 'Proveedor Calzado B',
                            contactPerson: 'Pedro Sánchez',
                            email: 'pedro.sanchez@proveedor-b.com',
                            phone: '5555555557',
                            address: 'Av. Revolución 456, Col. San Ángel',
                            taxId: 'XAXX010101001',
                            paymentTerms: 'Net 45',
                            leadTime: '20 días',
                            reliability: 'Medium',
                            status: 'active',
                        },
                        {
                            name: 'Proveedor Accesorios C',
                            contactPerson: 'Laura Torres',
                            email: 'laura.torres@proveedor-c.com',
                            phone: '5555555558',
                            address: 'Av. Tamaulipas 789, Col. Condesa',
                            taxId: 'XAXX010101002',
                            paymentTerms: 'Net 60',
                            leadTime: '10 días',
                            reliability: 'High',
                            status: 'active',
                        },
                    ];
                    _i = 0, suppliers_1 = suppliers;
                    _a.label = 1;
                case 1:
                    if (!(_i < suppliers_1.length)) return [3 /*break*/, 4];
                    supplier = suppliers_1[_i];
                    return [4 /*yield*/, prisma.supplier.upsert({
                            where: { name: supplier.name },
                            update: supplier,
                            create: supplier,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('✅ Proveedores sembrados exitosamente');
                    return [2 /*return*/];
            }
        });
    });
}
