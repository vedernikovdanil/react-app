import React from "react";
import _ from "lodash";
import "./FilterAccordion.css";
import { Accordion } from "react-bootstrap";
import FilterItem from "../FilterItem";
import { FilterResult } from "../../../models/Filter";

function FilterAccordion(props: { filterList: FilterResult[] }) {
  const activeKeys = React.useMemo(() => {
    return _.range(0, props.filterList.length + 1).map((v) => `${v}`);
  }, [props.filterList]);

  return (
    <Accordion
      className="mb-3 filter-accordion"
      defaultActiveKey={activeKeys}
      alwaysOpen
    >
      {props.filterList.map((filter, index) => (
        <Accordion.Item
          key={index}
          eventKey={`${index}`}
          className={!filter.default ? "checked" : ""}
        >
          <Accordion.Header>{filter.title}</Accordion.Header>
          <Accordion.Body className="p-0">
            <FilterItem filter={filter} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default FilterAccordion;
