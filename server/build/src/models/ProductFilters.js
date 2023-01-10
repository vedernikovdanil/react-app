"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Filter_1 = require("./Filter");
class ProductFilters {
    filters;
    constructor(data, companies) {
        const availOptions = [
            new Filter_1.Option("All", "all", () => true, true),
            new Filter_1.Option("In Stock", "instock", (item) => !!item.stock),
            new Filter_1.Option("No in Stock", "noinstock", (item) => !item.stock),
        ];
        const compOptions = companies.map((company) => {
            const predicate = (item) => item.company == company.name;
            return new Filter_1.Option(company.name, `${company.name}`, predicate);
        });
        const rateOptions = lodash_1.default.range(1, 5 + 1).map((i) => {
            const predicate = (item) => Math.round(item.rate) === i;
            return new Filter_1.Option("★".repeat(i), `${i}`, predicate);
        });
        this.filters = [
            new Filter_1.FilterText(data, "avail", "Availability", availOptions, true),
            new Filter_1.FilterRange(data, "price", "Price", "price"),
            new Filter_1.FilterText(data, "company", "Company", compOptions),
            new Filter_1.FilterText(data, "rate", "Rate", rateOptions, false, "text-warning"),
        ];
    }
}
exports.default = ProductFilters;
