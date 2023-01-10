import React from "react";
import { Card, Carousel } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import ProductList from "../components/products/ProductList";
import { BP_UP } from "../configuration";
import { DarkmodeContext } from "../context/DarkmodeContext";
import {
  getCategories,
  getImage,
  getRecommendProducts,
} from "../service/products";

export async function loader({ request, params }: any) {
  const url = new URL(request.url);
  const recommendProducts = await getRecommendProducts(4);
  const categories = await getCategories();
  return { url, recommendProducts, categories };
}

function Home() {
  const { recommendProducts, categories } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const { darkmode } = React.useContext(DarkmodeContext)!;
  const [index, setIndex] = React.useState(0);

  const carouselImages = React.useMemo(
    () =>
      Array(5)
        .fill(0)
        .map(() => {
          const id = Math.round(Math.random() * (categories.length - 2));
          const category = categories[id + 1];
          const imageId = Math.round(Math.random() * (50 - 1));
          return {
            src: getImage(`${category}${imageId + 1}`),
            alt: `${category}${imageId + 1}`,
          };
        }),
    // eslint-disable-next-line
    []
  );

  const handleSelect = (
    selectedIndex: number,
    e: Record<string, unknown> | null
  ) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <div className={`d-flex flex-column gap-2 gap-${BP_UP}-3`}>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          variant={darkmode ? "dark" : "light"}
        >
          {carouselImages.map((item, index) => (
            <Carousel.Item key={index} className="products-carousel">
              <img
                className="d-block w-100"
                style={{ objectFit: "cover" }}
                src={item.src}
                alt={item.alt}
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <Card>
          <Card.Body className="products-recommend">
            <Card.Title>Recommended:</Card.Title>
            <ProductList
              view="grid"
              products={recommendProducts}
              className="d-flex"
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Home;
