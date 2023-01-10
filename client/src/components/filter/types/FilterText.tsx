import React from "react";
import { Form } from "react-bootstrap";
import { FilterResult } from "../../../models/Filter";
import OptionList from "../OptionList";

function FilterText(props: {
  filter: FilterResult;
  maxShowCount: number;
  showAll: boolean | -1;
  setShowAll: ReactSetter<boolean | -1>;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const lastValues = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      lastValues.current = [...props.filter.checkedValues];
    };
  }, [props.filter.checkedValues]);

  const sortedOptions = React.useMemo(() => {
    const sorted = props.filter.options;
    if (sorted.length > props.maxShowCount) {
      sorted.sort((a, b) =>
        props.showAll ? a.name.localeCompare(b.name) : b.count - a.count
      );
      sorted.sort(
        (a, b) =>
          +lastValues.current.includes(b.value) -
          +lastValues.current.includes(a.value)
      );
    }
    return props.showAll ? sorted : sorted.slice(0, props.maxShowCount);
    // eslint-disable-next-line
  }, [props.filter.options, props.showAll]);

  const filteredOptions = React.useMemo(() => {
    return searchQuery.length
      ? props.filter.options.filter((option) =>
          option.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : sortedOptions;
    // eslint-disable-next-line
  }, [searchQuery, sortedOptions]);

  function onChangeSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    props.setShowAll(!!event.target.value.length && -1);
    setSearchQuery(event.target.value);
  }

  return (
    <>
      {props.filter.options.length > props.maxShowCount ? (
        <div className="m-2">
          <Form.Control
            type="search"
            value={searchQuery}
            placeholder="Search"
            onChange={onChangeSearchQuery}
          />
        </div>
      ) : undefined}
      <OptionList
        filter={props.filter}
        options={filteredOptions}
        showAll={props.showAll}
      />
    </>
  );
}
export default FilterText;
