import React from "react";
import _ from "lodash";
import { FilterResult } from "../../models/Filter";
import FilterText from "./types/FilterText";
import FilterRange from "./types/FilterRange";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { BP_UP } from "../../configuration";
import { FitlerContext } from "../../context/FilterContext";

const maxShowCount = 7;

const FilterComponents = {
  range: FilterRange,
  text: FilterText,
};

function FilterItem(props: { filter: FilterResult }) {
  const { submit } = React.useContext(FitlerContext)!;
  const [showAll, setShowAll] = React.useState<boolean | -1>(false);

  const overflowed = React.useMemo(() => {
    return props.filter.options.length > maxShowCount && showAll !== -1;
    // eslint-disable-next-line
  }, [showAll]);

  const popover = (
    <Popover
      id="popover-filter-item"
      className={`d-none d-${BP_UP}-block`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Popover.Body>
        <Button onClick={submit}>Search</Button>
      </Popover.Body>
    </Popover>
  );

  React.useLayoutEffect(() => {
    props.filter.default = checkFiltersValues("defaultValues");
    props.filter.active = !checkFiltersValues("pastValues");
    // eslint-disable-next-line
  }, [props.filter.checkedValues]);

  React.useEffect(() => {
    onReturn();
    // eslint-disable-next-line
  }, [props.filter.pastValues]);

  function checkFiltersValues(prop: "pastValues" | "defaultValues") {
    const filter = props.filter;
    return _.isEqual(_.sortBy(filter.checkedValues), _.sortBy(filter[prop]));
  }

  function setFilters(prop: "pastValues" | "defaultValues") {
    props.filter.checkedValues = [...props.filter[prop]];
    const elements = document.querySelectorAll(
      `input[name=${props.filter.name}]`
    ) as NodeListOf<HTMLInputElement>;
    [...elements].forEach(
      (el) => (el.checked = props.filter[prop].includes(el.value))
    );
  }

  const onReturn = () => setFilters("pastValues");
  const onReset = () => setFilters("defaultValues");

  function onResetReturnBtn() {
    if (props.filter.active) {
      (document.activeElement as HTMLElement)?.blur();
    }
    props.filter.active ? onReturn() : onReset();
  }

  const Component = FilterComponents[props.filter.type];

  return (
    <>
      <Component
        filter={props.filter}
        maxShowCount={maxShowCount}
        showAll={showAll}
        setShowAll={setShowAll}
      />
      <div className="d-flex justify-content-between p-2">
        <button
          type="button"
          className={`btn btn-link p-0 ${
            !overflowed || showAll === -1 ? "invisible" : ""
          }`}
          onClick={() => setShowAll((showAll) => !showAll)}
        >
          {showAll ? "Hide All" : "Show All"}
        </button>
        {!props.filter.default || props.filter.active ? (
          <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={onResetReturnBtn}
              onMouseDown={(e) => props.filter.active && e.preventDefault()}
            >
              {props.filter.default ? "Return" : "Reset"}
            </button>
          </OverlayTrigger>
        ) : undefined}
      </div>
    </>
  );
}

export default FilterItem;
