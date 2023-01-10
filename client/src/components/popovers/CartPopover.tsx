import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import ProductList from "../products/ProductList";

function CartPopover(props: { children: JSX.Element }) {
  const { cart } = React.useContext(AppContext)!;
  const [show, setShow] = React.useState(false);
  const timeoutHide = React.useRef<ReturnType<typeof setTimeout>>();
  const timeoutShow = React.useRef<ReturnType<typeof setTimeout>>();
  const timeoutNoAction = React.useRef<ReturnType<typeof setTimeout>>();

  function showPopover() {
    clearTimeout(timeoutHide.current);
    clearTimeout(timeoutNoAction.current);
    timeoutShow.current = setTimeout(() => setShow(true), 300);
  }

  function hidePopover() {
    clearTimeout(timeoutShow.current);
    timeoutHide.current = setTimeout(() => setShow(false), 150);
  }

  function onAdd() {
    showPopover();
    cart.emitter.on("update", scrollToProduct, { once: true });
    timeoutNoAction.current = setTimeout(() => setShow(false), 3000);
  }

  function scrollToProduct(id: number) {
    const options = { behavior: "smooth" } as const;
    document.getElementById(`product-cart-${id}`)?.scrollIntoView(options);
  }

  function onClick(e: Event) {
    const isButton = (e.target as HTMLElement).closest(".product button");
    const isPopover = (e.target as HTMLElement).closest(".product-cart");
    if (!isPopover && !isButton) {
      hidePopover();
    } else if (isPopover && e.type === "touchmove") {
      showPopover();
    }
  }

  React.useEffect(() => {
    const _onAdd = onAdd;
    const _onClick = onClick;

    cart.emitter.on("add", _onAdd);
    window.addEventListener("click", _onClick);
    window.addEventListener("touchmove", _onClick);
    return () => {
      cart.emitter.off("add", _onAdd);
      window.removeEventListener("click", _onClick);
      window.removeEventListener("touchmove", _onClick);
    };
    // eslint-disable-next-line
  }, []);

  const popover = (
    <Popover
      className="product-cart"
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      <Popover.Body>
        <ProductList products={cart.products} view="list" variant="cart" />
        {cart.products.length ? (
          <h4 className="text-end mt-3">
            Amount: <span>{cart.amount}</span>$
          </h4>
        ) : undefined}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      overlay={popover}
      placement="bottom-start"
      show={show && window.location.pathname !== "/cart"}
    >
      <div onMouseEnter={showPopover} onMouseLeave={hidePopover}>
        {props.children}
      </div>
    </OverlayTrigger>
  );
}

export default CartPopover;
