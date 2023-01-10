export type OptionResult = Readonly<{
  name: string;
  value: string;
  count: number;
  predicate: Function;
  checked: boolean;
  default: boolean;
}>;

export type FilterResult = Readonly<{
  title: string;
  name: string;
  type: "range" | "text";
  options: OptionResult[];
  radio: boolean;
  bsClass?: string;
  pastValues: string[];
  defaultValues: string[];
}> & {
  default: boolean;
  active: boolean;
  checkedValues: string[];
};

export type ValuesResult = FilterResult["checkedValues"];
