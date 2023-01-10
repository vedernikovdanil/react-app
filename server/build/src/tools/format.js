"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceFormat = void 0;
function priceFormat(value) {
    let price = `${value}`;
    const indexOfDot = price.indexOf(".");
    const lengthOfFract = indexOfDot !== -1 ? price.length - indexOfDot : 0;
    for (let i = price.length - lengthOfFract - 3; i > 0; i -= 3) {
        price = `${price.slice(0, i)} ${price.slice(i)}`;
    }
    return price;
}
exports.priceFormat = priceFormat;
