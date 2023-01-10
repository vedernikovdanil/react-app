import { ListGroup, ListGroupItem } from "react-bootstrap";
import { IProductCart } from "../../hooks/useCart";
import { IProduct } from "../../models/Product";
import Product, { ProductVariants } from "./Product";

type ProductListGProps<V extends ProductVariants> = V extends "cart"
  ? { variant: "cart"; products: IProductCart[] }
  : { variant?: V; products: IProduct[] };

export type ProductListProps<V extends ProductVariants> =
  ProductListGProps<V> & {
    view?: "stack" | "list" | "grid";
    setShowModal?: ReactSetter<boolean>;
    className?: string;
  };

function ProductList<V extends ProductVariants>(props: ProductListProps<V>) {
  if (!props.products.length) {
    return (
      <h3 className="text-muted">
        {props.variant === "cart" ? "Cart empty" : "There's nothing here"}
      </h3>
    );
  }
  switch (props.variant) {
    case "cart":
      return (
        <ListGroup as="ol" numbered>
          {props.products.map((product) => (
            <ListGroupItem
              key={product.productId}
              id={`product-cart-${product.productId}`}
              className="d-flex flex-column gap-1 p-2"
              as="li"
            >
              <Product variant="cart" {...product} />
            </ListGroupItem>
          ))}
        </ListGroup>
      );
    default:
      return (
        <div
          className={`d-grid gap-2 gap-sm-3 ${props.view}-view ${
            props.className || ""
          }`}
        >
          {props.products.map((product) => (
            <Product
              key={product.productId}
              variant={props.variant}
              {...product}
            />
          ))}
        </div>
      );
  }
}

export default ProductList;
