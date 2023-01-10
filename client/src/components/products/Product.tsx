import React from "react";
import _ from "lodash";
import "./styles.css";
import { Card, Row, Col, Button, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IProductCart } from "../../hooks/useCart";
import { IProduct } from "../../models/Product";
import { AppContext } from "../../context/AppContext";
import { getImage } from "../../service/products";
import priceFormat from "../../tools/priceFormat";
import Stars from "../elements/Stars";
import Count from "../elements/Count";

export type ProductVariants = "cart" | "page";

type ProductProps<V extends ProductVariants> = V extends "cart"
  ? { variant: "cart" } & IProductCart
  : { variant?: V } & IProduct;

function Product<V extends ProductVariants>(props: ProductProps<V>) {
  const { cart } = React.useContext(AppContext)!;

  React.useEffect(() => {
    if (props.variant === "cart" && props.productId === cart.lastAddedId) {
      cart.emitter.emit("update", props.productId);
    }
    // eslint-disable-next-line
  }, [props.variant === "cart" && props.count]);

  return (
    <div className={`product ${props.variant !== "cart" ? "card p-2" : ""}`}>
      {ProductImages(props)}
      <Link
        to={`/products/${props.category}/${props.productId}`}
        className="product-name truncate"
      >
        <Card.Text>{props.name}</Card.Text>
      </Link>
      <div className="product-company truncate">{props.company}</div>
      {ProductPrice(props)}
      <div className="product-subtitle-block">
        <Stars rate={props.rate} />
        <Count value={props.rateCount} />
      </div>
      <div className="product-subline-block">
        <span className={`text-${props.stock ? "success" : "danger"}`}>
          {props.stock ? `In Stock: ${props.stock}` : "No in stock"}
        </span>
      </div>
    </div>
  );
}

function ProductImages<V extends ProductVariants>(props: ProductProps<V>) {
  const [image, setImage] = React.useState(props.image);
  const imageList = React.useMemo(() => {
    const images = [props.image];
    for (let i = 1; i < 5; ++i) {
      images.push(`${props.category}${Math.round(Math.random() * 49) + 1}`);
    }
    return images;
  }, [props.image, props.category]);

  return (
    <Row className="product-images-block gx-0">
      {props.variant === "page" ? (
        <Col className="product-tape-block" xs="auto">
          <div className="product-tape">
            {imageList.map((src, index) => (
              <Card.Img
                key={index}
                src={getImage(src)}
                alt={src}
                onClick={() => setImage(src)}
                className={
                  image === src ? "border border-5 border-primary" : ""
                }
              />
            ))}
          </div>
        </Col>
      ) : undefined}
      <Col className="product-img">
        <Card.Img src={getImage(image)} />
      </Col>
    </Row>
  );
}

function ProductPrice<V extends ProductVariants>(props: ProductProps<V>) {
  const { cart } = React.useContext(AppContext)!;
  const [count, setCount] = React.useState(
    `${props.variant === "cart" ? props.count : 1}`
  );

  const price = React.useMemo(() => {
    const value = props.price * (props.variant === "cart" ? props.count : 1);
    return priceFormat(+value.toFixed(2));
  }, [props]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const int = parseInt(e.target.value);
    const value = _.clamp(isNaN(int) ? 1 : int, 1, props.stock);
    setCount(e.target.value && `${value}`);
    cart.setCount(props.productId, value);
  }

  React.useEffect(() => {
    if (props.variant === "cart" && count) {
      setCount(`${props.count}`);
    }
    // eslint-disable-next-line
  }, [props.variant === "cart" && props.count]);

  return (
    <div className="product-price-block">
      <div className="product-price">
        <Card.Title className="fw-bold">
          <span>{price}</span>$
        </Card.Title>
        {props.variant === "cart" ? (
          <label className="d-flex align-items-center gap-1">
            Count:
            <FormControl
              size="sm"
              value={count}
              type="number"
              min="1"
              max={props.stock}
              onChange={onChange}
              onBlur={() => setCount(`${props.count}`)}
            />
          </label>
        ) : undefined}
      </div>
      <Button
        className="product-buy-btn text-nowrap"
        disabled={props.stock === 0}
        onClick={() => cart.add(props.productId)}
      >
        <i className="bi bi-cart-fill" />
        <span> Buy</span>
      </Button>
      {props.variant === "cart" ? (
        <Button
          size="sm"
          variant="secondary"
          className="text-nowrap align-self-end align-baseline"
          onClick={() => cart.remove(props.productId)}
        >
          <i className="bi bi-trash3-fill me-1" />
          Remove
        </Button>
      ) : undefined}
    </div>
  );
}

export default Product;
