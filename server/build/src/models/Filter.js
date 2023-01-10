"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterRange = exports.FilterText = exports.Filter = exports.Option = exports.FilterList = void 0;
const lodash_1 = __importDefault(require("lodash"));
const format_1 = require("../tools/format");
class FilterList {
    data;
    _filters;
    get filters() {
        return this._filters.map((filter) => lodash_1.default.omit(filter, "data"));
    }
    constructor(data, ...filters) {
        this.data = data;
        this._filters = [...filters];
    }
    compute(query) {
        const predicateList = [];
        if (query) {
            Object.entries(query).forEach(([name, value]) => {
                const filter = this._filters.find((filter) => filter.name === name);
                if (filter) {
                    const values = (Array.isArray(value) ? value : [value]);
                    filter.checkedValues = filter.pastValues = values;
                    filter.options.forEach((o) => (o.checked = values.includes(o.value)));
                    const predicate = filter.getPredicateList(values);
                    predicateList.push(lodash_1.default.overSome(predicate));
                }
            });
        }
        return predicateList.length
            ? this.data.filter(lodash_1.default.overEvery(predicateList))
            : this.data;
    }
}
exports.FilterList = FilterList;
class Option {
    name;
    value;
    predicate;
    checked;
    count;
    default;
    constructor(name, value, predicate, checked = false, count) {
        this.name = name;
        this.value = value;
        this.predicate = predicate;
        this.checked = checked;
        this.count = count;
        this.default = checked;
    }
}
exports.Option = Option;
class Filter {
    data;
    name;
    title;
    radio;
    bsClass;
    checkedValues = [];
    defaultValues = [];
    pastValues = [];
    default = true;
    active = false;
    constructor(data, name, title, radio = false, bsClass = "") {
        this.data = data;
        this.name = name;
        this.title = title;
        this.radio = radio;
        this.bsClass = bsClass;
    }
    _getPredicateList(values) {
        return lodash_1.default.map(this.options.filter((option) => values.includes(option.value)), "predicate");
    }
    getPredicateList = this._getPredicateList;
    initValues() {
        this.checkedValues = lodash_1.default.map(lodash_1.default.filter(this.options, "default"), "value");
        this.defaultValues = lodash_1.default.map(lodash_1.default.filter(this.options, "checked"), "value");
        this.pastValues = this.defaultValues;
        this.options.forEach((option) => {
            option.count = option.count || this.data.filter(option.predicate).length;
        });
    }
}
exports.Filter = Filter;
class FilterText extends Filter {
    options;
    type = "text";
    constructor(data, name, title, options, radio = false, bsClass) {
        super(data, name, title, radio, bsClass);
        this.options = options;
        this.initValues();
    }
}
exports.FilterText = FilterText;
class FilterRange extends Filter {
    prop;
    type = "range";
    options;
    constructor(data, name, title, prop, radio = false, bsClass) {
        super(data, name, title, radio, bsClass);
        this.prop = prop;
        this.options = this.#computeRangeList();
        this.initValues();
    }
    getPredicateList = (values) => {
        const predicateList = super._getPredicateList(values);
        if (!predicateList.length) {
            const [min, max] = values[0].split("-");
            return [this.#getPredicate(+min, +max)];
        }
        return predicateList;
    };
    #computeRangeList(size = 6) {
        const fields = lodash_1.default.sortedUniq(lodash_1.default.map(this.data, this.prop).sort((a, b) => +a - +b));
        const chunks = lodash_1.default.chunk(fields, Math.ceil(this.data.length / size));
        if (chunks.length > size) {
            chunks.at(-1).push(...chunks.pop());
        }
        return chunks.map((chunk, index, array) => {
            const [min, max] = [+chunk.at(0), +chunk.at(-1)].map((v) => v.toFixed());
            const [minF, maxF] = [(0, format_1.priceFormat)(min), (0, format_1.priceFormat)(max)];
            const name = index === 0
                ? `Less ${maxF}`
                : index === array.length - 1
                    ? `${minF} and more`
                    : `${minF} - ${maxF}`;
            const predicate = this.#getPredicate(+min, +max);
            const range = [min, max].join("-");
            return new Option(name, range, predicate, false, chunk.length);
        });
    }
    #getPredicate(min, max) {
        return (item) => lodash_1.default.inRange(+item[this.prop], min - 0.1, max + 0.1);
    }
}
exports.FilterRange = FilterRange;
