import _ from "lodash";
import { priceFormat } from "../tools/format.js";

const CFG_PROP_NOT_EXIST =
  "set cfg property with include data in prototype class";
const DATA_PROP_NOT_EXIST = "set data in prototype class";

export class FilterList extends Array {
  /**
   * @param {Object[]} data
   * @param {Filter[]} args
   */
  constructor(data = null, ...args) {
    if (data) {
      Filter.prototype.cfg = { data };
      FilterOption.prototype.cfg = { data };
    }
    const rateOptions = _.range(1, 5 + 1).map((i) => {
      const predicate = (item) => Math.round(item.rating.rate) == i;
      return new FilterOption(`${i} Star`, `${i}`, predicate);
    });
    super(
      new Filter("price", "Price").Range("price"),
      new Filter("rate", "Rate").Text(rateOptions),
      ...args
    );
    this.data = data;
  }

  /**
   * @param {Object} query
   */
  compute(query) {
    if (!this.data) {
      throw new Error(DATA_PROP_NOT_EXIST);
    }
    let predicateList = [];
    Object.entries(query).forEach(([name, value]) => {
      const filter = this.find((filter) => filter.name === name);
      if (filter) {
        value = Array.isArray(value) ? value : [value];
        filter.checkedValues = filter.pastValues = value;
        filter.options.forEach((o) => (o.checked = value.includes(o.value)));
        const predicate = filter.getPredicateList(value);
        predicateList.push(_.overSome(predicate));
      }
    });
    return predicateList.length
      ? this.data.filter(_.overEvery(predicateList))
      : this.data;
  }
}

export class FilterOption {
  constructor(name, value, predicate, checked = false, count) {
    if (!this.cfg) {
      throw new Error(CFG_PROP_NOT_EXIST);
    }
    this.name = name;
    this.value = value;
    this.predicate = predicate;
    this.checked = checked;
    this.default = checked;
    this.count = count || this.cfg.data.filter(predicate).length;
  }
}

export class Filter {
  constructor(name, title, radio = false) {
    if (!this.cfg) {
      throw new Error(CFG_PROP_NOT_EXIST);
    }
    this.name = name;
    this.title = title;
    this.radio = radio;
    this.checkedValues = [];
    this.pastValues = [];
    this.defaultValues = [];
    this.default = true;
    this.active = false;
  }

  /**
   * @param {FilterOption[]} options
   */
  Text(options) {
    this.type = "text";
    this.options = options;
    this.#initValue();
    return this;
  }

  /**
   * @param {string} prop
   */
  Range(prop) {
    this.type = "range";
    this.prop = prop;
    this.options = this.#computeRangeList(prop, 6);
    this.#initValue();
    return this;
  }

  #initValue() {
    this.checkedValues = _.map(_.filter(this.options, "default"), "value");
    this.defaultValues = _.map(_.filter(this.options, "checked"), "value");
    this.pastValues = this.defaultValues;
  }

  getPredicateList(value) {
    if (value.length) {
      const predicate = this.options
        .filter((option) => value.includes(option.value))
        .map((option) => option.predicate);
      if (!predicate.length && this.type === "range") {
        const [min, max] = value[0].split("-");
        return [(item) => _.inRange(item[this.prop], min - 1, max + 1)];
      }
      return predicate;
    }
  }

  #computeRangeList(prop, size) {
    const fields = _.map(
      this.cfg.data.sort((a, b) => a[prop] - b[prop]),
      prop
    );
    const chunks = _.chunk(fields, this.cfg.data.length / size);
    if (chunks.length > size) {
      const last = chunks.pop();
      chunks.at(-1).push(...last);
    }
    return chunks.map((chunk, index, array) => {
      const [min, max] = [chunk.at(0), chunk.at(-1)];
      const [minF, maxF] = [priceFormat(min), priceFormat(max)];
      const name =
        index === 0
          ? `Less ${maxF}`
          : index === array.length - 1
          ? `${minF} and more`
          : `${minF} - ${maxF}`;
      const predicate = (item) => _.inRange(item[prop], min - 1, max + 1);
      const range = [min, max].join("-");
      return new FilterOption(name, range, predicate, false, chunk.length);
    });
  }
}
