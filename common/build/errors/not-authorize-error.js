"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizeError = void 0;
const errors_1 = require("../errors");
class NotAuthorizeError extends errors_1.CustomError {
    constructor() {
        super('Not authorized');
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizeError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not authorized' }];
    }
}
exports.NotAuthorizeError = NotAuthorizeError;
