import "./assets/css/bootstrap-nightshade.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DarkmodeProvider } from "./context/DarkmodeContext";
import App, { loader as appLoader } from "./App";
import Home, { loader as homeLoader } from "./pages/Home";
import ProductsPage, { loader as productsLoader } from "./pages/ProductsPage";
import ProductPage, { loader as productLoader } from "./pages/ProductPage";
import Test, { loader as testLoader } from "./pages/Test";
import CartPage from "./pages/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: "products",
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: "products/:category",
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: "products/:category/:id",
        element: <ProductPage />,
        loader: productLoader,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "test",
        element: <Test />,
        loader: testLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DarkmodeProvider>
      <RouterProvider router={router} />
    </DarkmodeProvider>
  </React.StrictMode>
);
