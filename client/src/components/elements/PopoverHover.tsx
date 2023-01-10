import React from "react";
import { OverlayTrigger, OverlayTriggerProps, Popover } from "react-bootstrap";

function PopoverHover(
  props: Omit<
    OverlayTriggerProps,
    "trigger" | "overlay" | "show" | "chlidren"
  > & {
    id: string;
    innerOverlay: JSX.Element;
    children: JSX.Element;
    className?: string;
    disabled?: boolean;
  }
) {
  const [show, setShow] = React.useState(props.defaultShow);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  function showPopover() {
    clearTimeout(timeout.current);
    setShow(true);
  }
  function hidePopover() {
    timeout.current = setTimeout(() => setShow(false), +(props.delay || 0));
  }

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
      setShow(false);
    };
  }, []);

  const popover = (
    <Popover
      id={`popover-${props.id}`}
      onClick={showPopover}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
      className={props.className}
    >
      <Popover.Body>{props.innerOverlay}</Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger {...props} show={!props.disabled && show} overlay={popover}>
      <div
        onClick={hidePopover}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
      >
        {props.children}
      </div>
    </OverlayTrigger>
  );
}

export default PopoverHover;
