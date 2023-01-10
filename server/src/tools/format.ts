export function priceFormat(value: string | number) {
  let price = `${value}`;
  const indexOfDot = price.indexOf(".");
  const lengthOfFract = indexOfDot !== -1 ? price.length - indexOfDot : 0;
  for (let i = price.length - lengthOfFract - 3; i > 0; i -= 3) {
    price = `${price.slice(0, i)} ${price.slice(i)}`;
  }
  return price;
}
