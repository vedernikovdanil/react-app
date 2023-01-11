import { IProductReview } from "../../models/ProductReview";
import Stars from "../Stars";

function ProductReivew(props: IProductReview) {
  return (
    <div>
      <div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-circle fs-1 text-muted"></i>
          <div className="d-grid">
            <span>{props.userName}</span>
            <span className="text-muted">{props.userEmail}</span>
          </div>
        </div>
      </div>
      <Stars rate={props.rate} />
      {props.comment ? <p>{props.comment}</p> : undefined}
    </div>
  );
}

export default ProductReivew;
