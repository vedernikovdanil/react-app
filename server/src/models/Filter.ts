import _ from "lodash";
import { priceFormat } from "../tools/format";

export class FilterList<T> {
  private _filters: Filter<T>[];

  get filters() {
    return this._filters.map((filter) => _.omit(filter, "data"));
  }

  constructor(public data: T[], ...filters: Filter<T>[]) {
    this._filters = [...filters];
  }

  compute(query?: qs.ParsedQs) {
    const predicateList: OptionPredicate<T>[] = [];
    if (query) {
      Object.entries(query).forEach(([name, value]) => {
        const filter = this._filters.find((filter) => filter.name === name);
        if (filter) {
          const values = (Array.isArray(value) ? value : [value]) as string[];
          filter.checkedValues = filter.pastValues = values;
          filter.options.forEach((o) => (o.checked = values.includes(o.value)));
          const predicate = filter.getPredicateList(values);
          predicateList.push(_.overSome(predicate));
        }
      });
    }
    return predicateList.length
      ? this.data.filter(_.overEvery(predicateList) as OptionPredicate<T>)
      : this.data;
  }
}

type OptionPredicate<T> = (item: T) => boolean;

export class Option<T> {
  default: boolean;

  constructor(
    public name: string,
    public value: string,
    public predicate: OptionPredicate<T>,
    public checked = false,
    public count?: number
  ) {
    this.default = checked;
  }
}

export abstract class Filter<T> {
  checkedValues: string[] = [];
  defaultValues: string[] = [];
  pastValues: string[] = [];
  default = true;
  active = false;
  abstract options: Option<T>[];
  abstract type: string;

  constructor(
    public data: T[],
    public name: string,
    public title: string,
    public radio = false,
    public bsClass = ""
  ) {}

  protected _getPredicateList(values: string[]) {
    return _.map(
      this.options.filter((option) => values.includes(option.value)),
      "predicate"
    );
  }

  getPredicateList = this._getPredicateList;

  protected initValues() {
    this.checkedValues = _.map(_.filter(this.options, "default"), "value");
    this.defaultValues = _.map(_.filter(this.options, "checked"), "value");
    this.pastValues = this.defaultValues;
    this.options.forEach((option) => {
      option.count = option.count || this.data.filter(option.predicate).length;
    });
  }
}

export class FilterText<T> extends Filter<T> {
  type = "text";

  constructor(
    data: T[],
    name: string,
    title: string,
    public options: Option<T>[],
    radio = false,
    bsClass?: string
  ) {
    super(data, name, title, radio, bsClass);
    this.initValues();
  }
}

export class FilterRange<T> extends Filter<T> {
  type = "range";
  options: Option<T>[];

  constructor(
    data: T[],
    name: string,
    title: string,
    public prop: keyof T,
    radio = false,
    bsClass?: string
  ) {
    super(data, name, title, radio, bsClass);
    this.options = this.#computeRangeList();
    this.initValues();
  }

  getPredicateList = (values: string[]) => {
    const predicateList = super._getPredicateList(values);
    if (!predicateList.length) {
      const [min, max] = values[0].split("-");
      return [this.#getPredicate(+min, +max)];
    }
    return predicateList;
  };

  #computeRangeList(size = 6) {
    const fields = _.sortedUniq(
      _.map(this.data, this.prop).sort((a, b) => +a - +b)
    ) as number[];
    const chunks = _.chunk(fields, Math.ceil(this.data.length / size));
    if (chunks.length > size) {
      chunks.at(-1)!.push(...chunks.pop()!);
    }
    return chunks.map((chunk, index, array) => {
      const [min, max] = [+chunk.at(0)!, +chunk.at(-1)!].map((v) =>
        v.toFixed()
      );
      const [minF, maxF] = [priceFormat(min), priceFormat(max)];
      const name =
        index === 0
          ? `Less ${maxF}`
          : index === array.length - 1
          ? `${minF} and more`
          : `${minF} - ${maxF}`;
      const predicate = this.#getPredicate(+min, +max);
      const range = [min, max].join("-");
      return new Option(name, range, predicate, false, chunk.length);
    });
  }

  #getPredicate(min: number, max: number) {
    return (item: T) => _.inRange(+item[this.prop], min - 0.1, max + 0.1);
  }
}
