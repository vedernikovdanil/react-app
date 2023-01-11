import _ from "lodash";

function getStarIcon(rate: number, value: number) {
  const type =
    rate >= value ? "-fill" : Math.round(rate) >= value ? "-half" : "";
  return `bi bi-star${type}`;
}

function Stars(props: { rate: number }) {
  return (
    <div className="text-warning">
      {_.range(1, 5 + 1).map((v) => (
        <i className={getStarIcon(props.rate, v)} key={v} />
      ))}
    </div>
  );
}

export default Stars;
