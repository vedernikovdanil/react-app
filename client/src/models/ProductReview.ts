export interface IProductReview {
  productReviewId: number;
  productId: number;
  userId: number;
  userName: string;
  userEmail: string;
  userImage?: string;
  commentId: number;
  comment?: string;
  commentImages?: string[];
  rate: number;
}
