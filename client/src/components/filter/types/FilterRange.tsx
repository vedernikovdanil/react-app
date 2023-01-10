import React from "react";
import _ from "lodash";
import { Form } from "react-bootstrap";
import { FilterResult } from "../../../models/Filter";
import OptionList from "../OptionList";

function FilterRange(props: {
  filter: FilterResult;
  maxShowCount: number;
  showAll: boolean | -1;
}) {
  const [rangeValue, setRangeValue] = React.useState(["", ""]);
  const [rangeInput, setRangeInput] = React.useState(["", ""]);

  const sortedOptions = React.useMemo(() => {
    return props.showAll
      ? props.filter.options
      : props.filter.options.slice(0, props.maxShowCount);
    // eslint-disable-next-line
  }, [props.showAll]);

  const extremes = React.useMemo(() => {
    return [0, 1].map((i) => props.filter.options.at(-i)!.value.split("-")[i]);
  }, [props.filter]);
  React.useEffect(() => {
    setRangeInput(
      props.filter.checkedValues.length === 1
        ? props.filter.checkedValues[0].split("-")
        : ["", ""]
    );
  }, [props.filter.checkedValues]);

  function onChangeRange(event: React.ChangeEvent<any>, index: number) {
    if (!rangeValue.join("")) {
      clearOptions();
    }
    const newRange = rangeInput;
    newRange[index] = event.target.value;
    setRangeValue([...newRange]);
    setRangeInput([...newRange]);
  }

  function onBlurRange(event: React.ChangeEvent<any>, index: number) {
    if (!rangeInput.join("")) {
      return;
    }
    let [min, max] = [+event.target.value, +rangeInput[+!index]];
    if (index) {
      [min, max] = [max, min];
      if (!rangeInput[+!index] && max <= +extremes[0]) {
        max = +extremes[1];
      }
    }
    [min, max] = [min, max].map((v) => _.clamp(v, +extremes[0], +extremes[1]));
    const newRange = [min, max || +extremes[1]].map((v) => `${v}`);
    props.filter.checkedValues = [newRange.join("-")];
    setRangeValue(newRange);
  }

  function onChangeOptions() {
    _.remove(props.filter.checkedValues, (v) => v === rangeValue.join("-"));
    setRangeValue(["", ""]);
  }

  function clearOptions() {
    const elements = document.querySelectorAll(
      `input[name=${props.filter.name}]`
    ) as NodeListOf<HTMLInputElement>;
    [...elements].forEach((el) => (el.checked = false));
  }

  return (
    <>
      <div className="d-flex gap-2 m-2">
        {[0, 1].map((i) => (
          <Form.Control
            key={i}
            type="number"
            step="any"
            className="fs-7-auto"
            min={extremes[0]}
            max={extremes[1]}
            value={rangeInput[i]}
            placeholder={extremes[i]}
            onChange={(event) => onChangeRange(event, i)}
            onBlur={(event) => onBlurRange(event, i)}
            onMouseUp={(event) => onBlurRange(event, i)}
          />
        ))}
      </div>
      <OptionList
        filter={props.filter}
        options={sortedOptions}
        onChange={onChangeOptions}
      />
    </>
  );
}

export default FilterRange;
