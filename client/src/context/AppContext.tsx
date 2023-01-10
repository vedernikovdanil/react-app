import React from "react";
import useCart from "../hooks/useCart";

export interface IAppContext {
  cart: ReturnType<typeof useCart>;
}

export const AppContext = React.createContext<IAppContext | null>(null);

export function AppProvider(props: { children: JSX.Element }) {
  const cart = useCart();

  return (
    <AppContext.Provider value={{ cart }}>{props.children}</AppContext.Provider>
  );
}
