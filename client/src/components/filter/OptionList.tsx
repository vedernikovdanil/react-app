import "./OptionList.css";
import { FilterResult, OptionResult } from "../../models/Filter";
import {
  Button,
  Form,
  ListGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import React from "react";
import { FitlerContext } from "../../context/FilterContext";
import { BP_UP } from "../../configuration";
import Count from "../Count";

function OptionList(props: {
  filter: FilterResult;
  options: OptionResult[];
  showAll?: boolean | -1;
  onChange?: () => void;
}) {
  const $list = React.useRef<HTMLDivElement>(null);
  const { submit } = React.useContext(FitlerContext)!;
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  const popover = (
    <Popover
      id="popover-filter-option"
      className={`d-none d-${BP_UP}-block`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Popover.Body>
        <Button onClick={submit}>Search</Button>
      </Popover.Body>
    </Popover>
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (props.filter.radio) {
      props.filter.checkedValues = [event.target.value];
    } else {
      props.filter.checkedValues = event.target.checked
        ? [...props.filter.checkedValues, event.target.value]
        : props.filter.checkedValues.filter((v) => v !== event.target.value);
    }
    props.onChange && props.onChange();
  }

  function blurInput(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const target = event.target as HTMLInputElement;
    if (!target.checked || props.filter.pastValues.includes(target.value)) {
      // event.preventDefault();
      target.blur();
    }
  }

  function onFocus(event: React.FocusEvent<HTMLDivElement>) {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => event.target.blur(), 3000);
  }

  return (
    <ListGroup
      className={`filter-list-group overflow-${
        props.showAll ? "auto" : "hidden"
      }`}
      variant="flush"
      ref={$list}
    >
      {props.options.length ? (
        props.options.map((option, index) => (
          <OverlayTrigger
            key={index}
            trigger="focus"
            placement="right"
            overlay={popover}
          >
            <ListGroup.Item as="div" action onFocus={onFocus}>
              <Form.Check
                id={`filter-input-${props.filter.name}-${option.name}`}
              >
                <Form.Check.Input
                  type={props.filter.radio ? "radio" : "checkbox"}
                  name={props.filter.name}
                  value={option.value}
                  checked={props.filter.checkedValues.includes(option.value)}
                  onChange={onChange}
                  onClick={blurInput}
                />
                <Form.Check.Label
                  className="d-flex stretched-link text-nowrap fs-7-auto"
                  title={option.name}
                >
                  <span className={`text-truncate ${props.filter.bsClass}`}>
                    {option.name}
                  </span>
                  <Count value={option.count} />
                </Form.Check.Label>
              </Form.Check>
            </ListGroup.Item>
          </OverlayTrigger>
        ))
      ) : (
        <p>there's nothing here</p>
      )}
    </ListGroup>
  );
}

export default OptionList;
