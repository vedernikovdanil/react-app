import React from "react";

export interface IFilterContext {
  submit: () => void;
  reset: () => void;
}

export const FitlerContext = React.createContext<IFilterContext | null>(null);
