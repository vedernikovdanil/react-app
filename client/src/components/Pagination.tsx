import React from "react";
import _ from "lodash";
import { PageItemProps, Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function PaginationComponent(props: {
  page: number;
  limit: number;
  query: URLSearchParams;
  countOfPages: number;
  countOfShow: number;
}) {
  const items = React.useMemo(() => {
    const [page, count] = [props.page, props.countOfPages];
    const half = Math.floor(props.countOfShow / 2);
    let min = _.clamp(page - half, 1, count);
    let max = _.clamp(page + half, 1, count);
    min = page + half > max ? max - props.countOfShow + 1 : min;
    max = page - half < min ? props.countOfShow : max;
    return (
      <>
        <Page page={1} active={page === 1} as={Pagination.First} />
        <Page page={page - 1} active={page === 1} as={Pagination.Prev} />
        {_.range(min, max + 1).map((i) => (
          <Page key={i} page={i} active={page === i} as={Pagination.Item} />
        ))}
        <Page page={page + 1} active={page === count} as={Pagination.Next} />
        <Page page={count} active={page === count} as={Pagination.Last} />
      </>
    );
    // eslint-disable-next-line
  }, [props]);

  function Page(props: {
    page: number;
    active: boolean;
    as: React.FC<PageItemProps>;
  }) {
    const _active = props.active;
    const isItem = props.as === Pagination.Item;
    const [active, disabled] = [isItem && _active, !isItem && _active];
    return (
      <LinkContainer to={{ search: getQuery(props.page).toString() }}>
        <props.as active={active} disabled={disabled}>
          {isItem ? props.page : undefined}
        </props.as>
      </LinkContainer>
    );
  }

  function getQuery(page: number) {
    const query = new URLSearchParams(props.query.toString());
    query.set("page", `${page}`);
    query.set("limit", `${props.limit}`);
    return query;
  }

  const getSize = () => (window.innerWidth > 767 ? "lg" : undefined);
  const [size, setSize] = React.useState<undefined | "lg">(getSize);

  React.useEffect(() => {
    const debounce = _.debounce(() => setSize(getSize()), 500);
    window.addEventListener("resize", debounce);
    return () => {
      window.removeEventListener("resize", debounce);
    };
  }, []);

  return (
    <div className="d-flex align-self-center">
      <Pagination size={size}>{items}</Pagination>
    </div>
  );
}

export default PaginationComponent;
