import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { getProducts } from "../service/products";
import useProxyCollection from "../hooks/useProxyCollection";
import ProductFilter from "../components/products/ProductFilter";
import ProductList from "../components/products/ProductList";
import ProductOrder from "../components/products/ProductOrder";
import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";
import { BP_UP } from "../configuration";

export async function loader({ request, params }: any) {
  const url = new URL(request.url);
  const response = await getProducts(params.category, url.search);
  const countOfPages = Math.ceil(response.total / response.limit);
  return { ...response, countOfPages, url };
}

function ProductsPage() {
  const { products, filters, page, limit, total, countOfPages, url, category } =
    useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigation = useNavigation();
  const [gridView, setGridView] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const proxyFilters = useProxyCollection(filters);

  const loadingCSSClass = navigation.state !== "idle" ? "loading" : "";

  React.useEffect(
    // @ts-expect-error [mildly irritated message]
    () => window.scrollTo({ top: 0, behavior: "instant" }),
    [url.href]
  );

  return (
    <div className="products-page">
      <PageHeader
        page={page}
        countOfPages={countOfPages}
        countOfItems={total}
        category={category}
      />
      <Row className={`gx-2 gx-sm-3 ${loadingCSSClass}`}>
        <Col {...{ [BP_UP]: "auto" }}>
          <ProductFilter
            query={url.searchParams}
            filterList={proxyFilters}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </Col>
        <Col className="d-flex flex-column gap-2 gap-sm-3 overflow-hidden">
          <ProductOrder
            query={url.searchParams}
            filterList={proxyFilters}
            limit={limit}
            gridView={gridView}
            setGridView={setGridView}
            setShowModal={setShowModal}
          />
          <ProductList
            products={products}
            view={gridView ? "grid" : "stack"}
            setShowModal={setShowModal}
            className="mb-4"
          />
          <Pagination
            page={+page}
            limit={+limit}
            query={url.searchParams}
            countOfPages={+countOfPages}
            countOfShow={5}
          />
        </Col>
      </Row>
    </div>
  );
}

export default ProductsPage;
