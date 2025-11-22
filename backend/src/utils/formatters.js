"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedLogInfo = void 0;
var formattedLogInfo = function (req, data) {
    var information = {
        userEmail: data.email,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    };
    return information;
};
exports.formattedLogInfo = formattedLogInfo;
