import Count from "./Count";

function PageHeader(props: {
  page: number;
  countOfPages: number;
  countOfItems: number;
  category: string;
}) {
  return (
    <div className="d-flex flex-wrap mb-2 mb-sm-3">
      <span className="text-nowrap me-3">
        <span className="h1">
          Page <span>{props.page}</span>
        </span>
        <span className="h3 text-muted">
          {" "}
          / <span>{props.countOfPages}</span>
        </span>
      </span>
      <span className="text-nowrap">
        <span className="h1 text-capitalize">
          <span>{props.category || "all"}</span>
        </span>
        &nbsp;
        <Count value={props.countOfItems} className="h3" />
      </span>
    </div>
  );
}

export default PageHeader;
