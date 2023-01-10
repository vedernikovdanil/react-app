"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = exports.isNumeric = void 0;
const lodash_1 = __importDefault(require("lodash"));
function isNumeric(str) {
    if (typeof str != "string")
        return false;
    return !lodash_1.default.isNaN(str) && !lodash_1.default.isNaN(parseFloat(str));
}
exports.isNumeric = isNumeric;
const toNumber = (v) => isNumeric(v) ? lodash_1.default.toNumber(v) : v || 0;
exports.toNumber = toNumber;
