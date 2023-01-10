import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import Product from "../components/products/Product";
import ProductReivew from "../components/products/ProductReview";
import { BP_UP } from "../configuration";
import { getProduct, getProductReviews } from "../service/products";

export async function loader({ request, params }: any) {
  const url = new URL(request.url);
  const product = await getProduct(params.id);
  const reviews = await getProductReviews(params.id);
  return { url, product, reviews };
}

function ProductPage() {
  const { product, reviews } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <div className={`product-page d-flex flex-column gap-2 gap-${BP_UP}-3`}>
      <Product {...product} variant="page" />
      <Card>
        <Card.Body>
          <Card.Title>Description:</Card.Title>
          {product.description}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Reviews:</Card.Title>
          <ListGroup>
            {reviews.length
              ? reviews.map((review, index) => (
                  <ListGroupItem key={index}>
                    <ProductReivew {...review} />
                  </ListGroupItem>
                ))
              : "No Comments"}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProductPage;
