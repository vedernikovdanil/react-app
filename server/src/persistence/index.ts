import mysql, { OkPacket, RowDataPacket } from "mysql2";
import waitPort from "wait-port";
import fs from "fs/promises";
import * as I from "../models/products";
import * as CFG from "../../configuration";

const SKIP_SCHEMA = "Schema generation was skipped.";

let pool: mysql.Pool;

export async function init() {
  await waitPort({ host: CFG.MYSQL_HOST, port: +CFG.MYSQL_PORT! });

  pool = mysql.createPool({
    connectionLimit: 5,
    host: CFG.MYSQL_HOST,
    user: CFG.MYSQL_USER,
    password: CFG.MYSQL_PASSWORD,
    database: CFG.MYSQL_DATABASE,
  });

  try {
    await new Promise((res, rej) => {
      getProducts()
        .then(({ length }) => (length ? rej(new Error(SKIP_SCHEMA)) : res(0)))
        .catch((err) => res(err));
    });
    const schema = await fs.readFile("schema/ProductsDB.sql", "utf-8");
    for (const command of schema.split(";")) {
      if (command) {
        await new Promise((res, rej) => {
          pool.query(command, (err, rows) => (err && rej(err)) || res(null));
        });
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
}

export const getProduct = (id: number) => getProducts("", id);
export function getProducts(category?: string): Promise<I.IProduct[]>;
export function getProducts(category: string, id: number): Promise<I.IProduct>;
export function getProducts(category = "", id?: number) {
  const condition: string[] = [];
  Object.entries({ "category.name": category, "p.productId": id }).forEach(
    ([key, value]) => value && condition.push(`${key} = '${value}'`)
  );
  return new Promise<I.IProduct | I.IProduct[]>((res, rej) => {
    pool.query<I.IProduct[]>(
      `SELECT
        p.*,
        category.name as category,
        company.name as company,
        AVG(r.rate) as rate,
        COUNT(r.productReviewId) as rateCount
      FROM product p
      JOIN category ON category.categoryId = p.categoryId
      JOIN company ON company.companyId = p.companyId
      LEFT JOIN productReview r ON r.productId = p.productId
      ${condition.length ? `WHERE ${condition.join(" AND ")}` : ""}
      GROUP by p.productId`,
      (err, rows) => {
        if (err) rej(err);
        res(typeof id === "number" ? rows[0] : rows);
      }
    );
  });
}

export function storeProduct(product: I.IProductRequest) {
  return new Promise<I.IProduct>((res, rej) => {
    const { name, description, categoryId, companyId, image, stock, price } =
      product;
    pool.query<OkPacket>(
      `INSERT INTO product
      (name,description,categoryId,companyId,image,stock,price)
      VALUES (?,?,?,?,?,?,?)`,
      [name, description, categoryId, companyId, image, stock, price],
      (err, result) => {
        if (err) rej(err);
        getProduct(result.insertId)
          .then((product) => res(product))
          .catch((err) => rej(err));
      }
    );
  });
}

export function updateProduct(id: number, product: I.IProductRequest) {
  return new Promise<I.IProduct>((res, rej) => {
    const { name, description, categoryId, companyId, image, stock, price } =
      product;
    pool.query<OkPacket>(
      `UPDATE product SET
      name=?,description=?,categoryId=?,companyId=?,image=?,stock=?,price=?
      WHERE id=?`,
      [name, description, categoryId, companyId, image, stock, price, id],
      (err, result) => {
        if (err) rej(err);
        getProduct(id)
          .then((product) => res(product))
          .catch((err) => rej(err));
      }
    );
  });
}

export function removeProduct(id: number) {
  return new Promise<I.IProduct>((res, rej) => {
    pool.query<OkPacket>("DELETE product WHERE id=?", [id], (err, result) => {
      if (err) rej(err);
      getProduct(id)
        .then((product) => res(product))
        .catch((err) => rej(err));
    });
  });
}

export function getProductReviews(productId: number) {
  return new Promise<I.IProductReview[]>((res, rej) => {
    pool.query<I.IProductReview[]>(
      `
    SELECT
      pr.*,
      u.userName as userName,
      u.email as userEmail,
      u.image as userImage,
      c.comment as comment
    FROM productReview pr
    LEFT JOIN user u ON u.userId = pr.userId
    LEFT JOIN comment c ON c.commentId = pr.commentId
    WHERE pr.productId=?`,
      [productId],
      (err, rows) => {
        if (err) rej(err);
        res(rows);
      }
    );
  });
}

export function getCommentImages(id: number) {
  return new Promise<string[]>((res, rej) => {
    pool.query<(string & RowDataPacket)[]>(
      "SELECT * FROM commentImage WHERE commentId=?",
      [id],
      (err, rows) => {
        if (err) rej(err);
        res(rows);
      }
    );
  });
}

export function getCategories() {
  return new Promise<I.ICategory[]>((res, rej) => {
    pool.query<I.ICategory[]>("SELECT * FROM category", (err, rows) => {
      if (err) rej(err);
      res(rows);
    });
  });
}

export function getCompanies() {
  return new Promise<I.ICompany[]>((res, rej) => {
    pool.query<I.ICompany[]>("SELECT * FROM company", (err, rows) => {
      if (err) rej(err);
      res(rows);
    });
  });
}
