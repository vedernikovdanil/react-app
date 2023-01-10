import _ from "lodash";
import { Filter, FilterRange, FilterText, Option } from "./Filter";
import { ICompany, IProduct } from "./products";

export default class ProductFilters {
  filters: Filter<IProduct>[];

  constructor(data: IProduct[], companies: ICompany[]) {
    const availOptions: Option<IProduct>[] = [
      new Option("All", "all", () => true, true),
      new Option("In Stock", "instock", (item) => !!item.stock),
      new Option("No in Stock", "noinstock", (item) => !item.stock),
    ];
    const compOptions = companies.map((company) => {
      const predicate = (item: IProduct) => item.company == company.name;
      return new Option(company.name, `${company.name}`, predicate);
    });
    const rateOptions = _.range(1, 5 + 1).map((i) => {
      const predicate = (item: IProduct) => Math.round(item.rate) === i;
      return new Option("★".repeat(i), `${i}`, predicate);
    });
    this.filters = [
      new FilterText(data, "avail", "Availability", availOptions, true),
      new FilterRange(data, "price", "Price", "price"),
      new FilterText(data, "company", "Company", compOptions),
      new FilterText(data, "rate", "Rate", rateOptions, false, "text-warning"),
    ];
  }
}
