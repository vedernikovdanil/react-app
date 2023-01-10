import { FilterResult } from "../models/Filter";
import { IProduct } from "../models/Product";
import { IProductReview } from "../models/ProductReview";

type IGetProducts = Promise<{
  products: IProduct[];
  filters: FilterResult[];
  category: string;
  total: number;
  page: number;
  limit: number;
}>;

export async function getProducts(category = "", query = ""): IGetProducts {
  category && (category += "/");
  const response = await fetch(`/api/products/${category}${query}`);
  return await response.json();
}

export async function getProduct(id: number | string): Promise<IProduct> {
  const response = await fetch(`/api/product/${id}`);
  return await response.json();
}

export async function getRecommendProducts(count: number): Promise<IProduct[]> {
  const response = await fetch(`/api/products/recommend/${count}`);
  return await response.json();
}

export async function getProductReviews(id: number): Promise<IProductReview[]> {
  const response = await fetch(`/api/reviews/${id}`);
  return await response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch("/api/categories");
  return await response.json();
}

export function getImage(name: string) {
  return `/api/images/${name}`;
}
