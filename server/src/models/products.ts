import { RowDataPacket } from "mysql2";

export interface IProductRequest {
  name: string;
  description?: string;
  categoryId: number;
  companyId: number;
  image?: string;
  stock?: number;
  price?: number;
}

export interface ProductRequest extends IProductRequest {}
export class ProductRequest {
  constructor() {}
}

export interface IProduct extends IProductRequest, RowDataPacket {
  productId: number;
  category: string;
  company: string;
  rate: number;
  rateCount: number;
}

export interface IProductReview extends RowDataPacket {
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

export interface IUser extends RowDataPacket {
  userId: number;
  userName: string;
  email: string;
  image?: string;
}

export interface IComment extends RowDataPacket {
  commentId: number;
  comment: string;
  images?: string[];
}

export interface ICategory extends RowDataPacket {
  categoryId: string;
  name: string;
}

export interface ICompany extends RowDataPacket {
  companyId: string;
  name: string;
}
