import _ from "lodash";

export function isNumeric(str: string | number | undefined) {
  if (typeof str != "string") return false;
  return !_.isNaN(str) && !_.isNaN(parseFloat(str));
}

export const toNumber = (v: string | number) =>
  isNumeric(v) ? _.toNumber(v) : v || 0;
