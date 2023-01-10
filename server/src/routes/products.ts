import { Router } from "express";
import _ from "lodash";
import path from "path";
import { toNumber } from "../tools/number";
import { FilterList } from "../models/Filter";
import ProductFilters from "../models/ProductFilters";
import * as db from "../persistence";

const router = Router();

router.get("/products/:category?", async (req, res) => {
  const { page = 1, limit = 10, order = "productId", desc, ...q } = req.query;

  const companies = await db.getCompanies();
  const categories = await db.getCategories();

  const category =
    categories.findIndex((c) => c.name === req.params.category) !== -1
      ? req.params.category?.toString()
      : undefined;

  const products = await db.getProducts(category);
  const productFilters = new ProductFilters(products, companies);
  const filterList = new FilterList(products, ...productFilters.filters);
  const filteredProducts = filterList.compute(q);

  const _desc = desc === "true" ? "desc" : "asc";
  const _order = `${order}` in products[0] ? `${order}` : "productId";
  let content = _.orderBy(filteredProducts, (v) => toNumber(v[_order]), _desc);

  if (page || limit) {
    const [pageNum, limitNum] = [+(page || 1), +(limit || 10)];
    const start = (pageNum - 1) * limitNum;
    content = content.slice(start, start + limitNum);
  }
  res.status(200).json({
    products: content,
    filters: filterList.filters,
    category,
    total: filteredProducts.length,
    page,
    limit,
  });
});

router.get("/product/:id", async (req, res) => {
  const product = await db.getProduct(+req.params.id);
  res.status(200).send(product);
});

router.post("/products", async (req, res) => {
  const product = await db.storeProduct(req.body);
  res.status(201).send(product);
});

router.put("/products/:id", async (req, res) => {
  const product = await db.updateProduct(+req.params.id, req.body);
  res.status(200).send(product);
});

router.patch("/products/:id", async (req, res) => {
  const productSource = await db.getProduct(+req.params.id);
  const product = Object.assign(productSource, req.body);
  await db.updateProduct(+req.params.id, product);
  res.send(product);
});

router.delete("/products/:id", async (req, res) => {
  const product = await db.removeProduct(+req.params.id);
  res.status(204).send(product);
});

router.get("/products/recommend/:count?", async (req, res) => {
  const count = req.params.count || 5;
  const products = await db.getProducts();
  const content = [];
  for (let i = 0; i < count; ++i) {
    const id = Math.round(Math.random() * (products.length - 1));
    const product = products.at(id);
    if (!product) {
      res.status(500).end("Unhandled error");
      return;
    } else {
      content.push(product);
    }
  }
  res.status(200).send(content);
});

router.get("/reviews/:productId", async (req, res) => {
  const reviews = await db.getProductReviews(+req.params.productId);
  for (const review of reviews) {
    review.commentImages = await db.getCommentImages(+req.params.productId);
  }
  res.status(200).send(reviews);
});

router.get("/categories", async (req, res) => {
  const categories = await db.getCategories();
  res.status(200).send(_.map(categories, "name"));
});

router.get("/images/:name", async (req, res) => {
  res.status(200).sendFile(path.resolve(`images/${req.params.name}.jpg`));
});

export default router;
