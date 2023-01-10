import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BP, BP_UP } from "../../configuration";
import { FilterResult } from "../../models/Filter";

type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

function ProductSettings(props: {
  query: URLSearchParams;
  filterList: FilterResult[];
  limit: number;
  gridView: boolean;
  setGridView: ReactSetter<boolean>;
  setShowModal: ReactSetter<boolean>;
}) {
  const navigate = useNavigate();

  const defaultLimit = React.useRef(props.limit);
  const defaultGridView = React.useRef(props.gridView);
  const order = React.useMemo(() => props.query.get("order"), [props.query]);
  const desc = React.useMemo(() => props.query.get("desc"), [props.query]);
  const filterActive = React.useMemo(
    () => props.filterList.reduce((acc, f) => (acc = acc || !f.default), false),
    [props]
  );

  function setQuery(name: string, value: any, replace = true) {
    value ? props.query.set(name, `${value}`) : props.query.delete(name);
    replace && navigate(`?${props.query.toString()}`);
  }

  function onReset() {
    props.setGridView(defaultGridView.current);
    const replace = props.limit !== defaultLimit.current || order || desc;
    setQuery("limit", undefined, false);
    setQuery("order", undefined, false);
    setQuery("desc", undefined, !!replace);
  }

  return (
    <div className="d-flex align-items-center gap-2 overflow-auto shadowed">
      <InputGroup className="flex-nowrap">
        <Button
          variant="outline-secondary"
          onClick={() => setQuery("desc", !desc)}
        >
          <span className={`d-none d-${BP}-block text-nowrap`}>
            {desc ? "Descending" : "Ascending"}
          </span>
          <i className={`bi bi-arrow-${desc ? "down" : "up"} d-md-none`} />
        </Button>
        <Form.Select
          className="w-auto"
          onChange={(event) => setQuery("order", event.target.value)}
          value={order || ""}
        >
          <option value="" disabled>
            Select sort type
          </option>
          <option value="rateCount">Popularity</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
          <option value="rate">Rate</option>
        </Form.Select>
      </InputGroup>
      <InputGroup className="flex-nowrap w-auto">
        <InputGroup.Text>Limit</InputGroup.Text>
        <Form.Select
          className="w-auto"
          value={props.limit}
          onChange={(event) => setQuery("limit", +event.target.value)}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </Form.Select>
      </InputGroup>
      <Button
        variant="outline-secondary text-nowrap align-baseline"
        onClick={onReset}
      >
        <i className="bi bi-eraser-fill me-1" />
        Reset
      </Button>
      <Button
        variant={`${!filterActive ? "outline-" : ""}primary`}
        className={`d-block d-${BP_UP}-none text-nowrap align-baseline`}
        onClick={() => props.setShowModal(true)}
      >
        <i className="bi bi-funnel-fill me-1" />
        Filter
      </Button>
      <Button
        className="border"
        variant={!props.gridView ? "secondary" : "light"}
        onClick={() => props.setGridView(false)}
      >
        <i className="bi bi-view-stacked" />
      </Button>
      <Button
        className="border"
        variant={props.gridView ? "secondary" : "light"}
        onClick={() => props.setGridView(true)}
      >
        <i className="bi bi-grid" />
      </Button>
    </div>
  );
}

export default ProductSettings;
