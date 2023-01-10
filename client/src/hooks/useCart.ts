import _ from "lodash";
import React from "react";
import { IProduct } from "../models/Product";
import { getProduct } from "../service/products";
import priceFormat from "../tools/priceFormat";
import useEventEmitter from "./useEventEmitter";

export interface ICartItem {
  id: number;
  count: number;
}

export interface IProductCart extends IProduct, Omit<ICartItem, "id"> {}

export default function useCart() {
  const [cart, setCart] = React.useState<ICartItem[]>(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [products, setProducts] = React.useState<IProductCart[]>([]);
  const amount = React.useMemo(() => {
    const value = +products.reduce((acc, p) => (acc += p.price * p.count), 0);
    return priceFormat(+value.toFixed(2));
  }, [products]);
  const [lastAddedId, setLastAddedId] = React.useState<number>();
  const emitter =
    useEventEmitter<["add", "remove", "count", "clear", "update"]>();

  function add(id: number) {
    setLastAddedId(id);
    emitter.emit("add", id);
    const index = cart.findIndex((i) => i.id === id);
    if (index !== -1) {
      cart[index].count++;
      setCart([...cart]);
    } else {
      setCart([...cart, { id, count: 1 }]);
    }
  }

  function remove(id: number) {
    emitter.emit("remove", id);
    setCart(cart.filter((item) => item.id !== id));
  }

  function setCount(id: number, count: number) {
    emitter.emit("count", id, count);
    if (count === 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      const index = cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        cart[index].count = count;
        setCart([...cart]);
      }
    }
  }

  function clear() {
    emitter.emit("clear");
    setCart([]);
  }

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    new Promise<IProductCart[]>(async (res, rej) => {
      const idList = _.map(cart, "id");
      const newProducts = products.filter((p) => idList.includes(p.productId));
      for (const item of cart) {
        const index = newProducts.findIndex((p) => p.productId === item.id);
        if (index === -1) {
          const product = await getProduct(item.id);
          newProducts.push({ ...product, count: item.count });
        } else {
          newProducts[index].count = item.count;
        }
      }
      res(newProducts);
    }).then((products) => setProducts(products));
    // eslint-disable-next-line
  }, [cart]);

  return {
    products,
    add,
    remove,
    setCount,
    clear,
    amount,
    lastAddedId,
    emitter,
  };
}
