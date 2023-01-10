import React from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Offcanvas } from "react-bootstrap";
import useStickyEdges from "../../hooks/useStickyEdges";
import { FilterResult } from "../../models/Filter";
import FilterAccordion from "../filter/views/FilterAccordion";
import FilterTab from "../filter/views/FilterTab";
import { BP_UP } from "../../configuration";
import { FitlerContext } from "../../context/FilterContext";

function ProductFilter(props: {
  query: URLSearchParams;
  filterList: FilterResult[];
  showModal: boolean;
  setShowModal: ReactSetter<boolean>;
  className?: string;
}) {
  const navigate = useNavigate();

  const [displayModal, setDisplayModal] = React.useState(false);
  const $sidebar = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setDisplayModal(props.showModal);
  }, [props.showModal]);

  function submit() {
    (document.activeElement as HTMLInputElement)!.blur();
    const query = new URLSearchParams(props.query.toString());
    props.filterList.forEach((filter) => {
      query.delete(filter.name);
      filter.checkedValues.forEach((value) => {
        query.append(filter.name, value);
      });
    });
    query.set("page", "1");
    setDisplayModal(false);
    navigate(`?${query.toString()}`);
  }

  function reset() {
    props.filterList.forEach((filter) => {
      filter.checkedValues = [...filter.defaultValues];
      const elements = document.querySelectorAll(
        `input[name=${filter.name}]`
      ) as NodeListOf<HTMLInputElement>;
      [...elements].forEach(
        (el) => (el.checked = filter.defaultValues.includes(el.value))
      );
    });
  }

  useStickyEdges($sidebar, [65 + 16, 16], () => window.innerWidth > 991);

  return (
    <FitlerContext.Provider value={{ submit, reset }}>
      <div className="filter d-flex flex-column h-100">
        {props.showModal ? (
          <Offcanvas
            className="w-100"
            responsive={BP_UP}
            show={displayModal}
            onHide={() => setDisplayModal(false)}
            onExited={() => props.setShowModal(false)}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Product Filter</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FilterTemplate
                onSubmit={submit}
                onReset={reset}
                showSubmit={_.some(props.filterList, "active")}
              >
                <FilterTab filterList={props.filterList} />
              </FilterTemplate>
            </Offcanvas.Body>
          </Offcanvas>
        ) : (
          <div
            className={`d-none d-${BP_UP}-block ${props.className || ""}`}
            style={{ position: "relative" }}
            ref={$sidebar}
          >
            <FilterTemplate onSubmit={submit} onReset={reset}>
              <FilterAccordion filterList={props.filterList} />
            </FilterTemplate>
          </div>
        )}
      </div>
    </FitlerContext.Provider>
  );
}

export default ProductFilter;

function FilterTemplate(props: {
  children: JSX.Element;
  showSubmit?: boolean;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="d-flex flex-column h-100">
      <Form.Control
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="mb-2 mb-sm-3 shadow-sm"
        placeholder="Search product"
      />
      {props.children}
      <Card>
        <Card.Body className="d-grid gap-2">
          {props.showSubmit !== false ? (
            <Button variant="primary" onClick={props.onSubmit}>
              Search
            </Button>
          ) : undefined}
          <Button variant="secondary" onClick={props.onReset}>
            Reset
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
