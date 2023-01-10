import React from "react";
import { Button } from "react-bootstrap";
import ProductList from "../components/products/ProductList";
import { AppContext } from "../context/AppContext";

function CartPage() {
  const { cart } = React.useContext(AppContext)!;
  const pieces = React.useMemo(
    () => cart.products.reduce((acc, p) => (acc += p.count), 0),
    [cart.products]
  );

  function checkoutOrder() {
    alert("Order completed successfully");
    cart.clear();
  }

  return (
    <div className="product-cart">
      <h1>Cart</h1>
      <div className="d-flex flex-row-reverse ms-auto gap-2 mb-2">
        {cart.products.length ? (
          <Button
            size="sm"
            variant="danger"
            className="align-baseline"
            onClick={cart.clear}
          >
            <i className="bi bi-trash3-fill me-1" />
            Remove All
          </Button>
        ) : undefined}
      </div>
      <ProductList products={cart.products} view="list" variant="cart" />
      {cart.products.length ? (
        <div className="text-end">
          <hr />
          <div className="my-3">
            <h5>
              Count: <span>{pieces}</span> pcs.
            </h5>
            <h3>
              Amount:
              <span className="font-monospace fw-bold ms-2">
                <span>{cart.amount}</span> $
              </span>
            </h3>
          </div>
          <Button variant="success" onClick={checkoutOrder}>
            Checkout order
          </Button>
        </div>
      ) : undefined}
    </div>
  );
}

export default CartPage;
