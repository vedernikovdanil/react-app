"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = exports.getCategories = exports.getCommentImages = exports.getProductReviews = exports.removeProduct = exports.updateProduct = exports.storeProduct = exports.getProducts = exports.getProduct = exports.init = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const wait_port_1 = __importDefault(require("wait-port"));
const promises_1 = __importDefault(require("fs/promises"));
const CFG = __importStar(require("../../configuration"));
const SKIP_SCHEMA = "Schema generation was skipped.";
let pool;
async function init() {
    await (0, wait_port_1.default)({ host: CFG.MYSQL_HOST, port: +CFG.MYSQL_PORT });
    pool = mysql2_1.default.createPool({
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
        const schema = await promises_1.default.readFile("schema/ProductsDB.sql", "utf-8");
        for (const command of schema.split(";")) {
            if (command) {
                await new Promise((res, rej) => {
                    pool.query(command, (err, rows) => (err && rej(err)) || res(null));
                });
            }
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
}
exports.init = init;
const getProduct = (id) => getProducts("", id);
exports.getProduct = getProduct;
function getProducts(category = "", id) {
    const condition = [];
    Object.entries({ "category.name": category, "p.productId": id }).forEach(([key, value]) => value && condition.push(`${key} = '${value}'`));
    return new Promise((res, rej) => {
        pool.query(`SELECT
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
      GROUP by p.productId`, (err, rows) => {
            if (err)
                rej(err);
            res(typeof id === "number" ? rows[0] : rows);
        });
    });
}
exports.getProducts = getProducts;
function storeProduct(product) {
    return new Promise((res, rej) => {
        const { name, description, categoryId, companyId, image, stock, price } = product;
        pool.query(`INSERT INTO product
      (name,description,categoryId,companyId,image,stock,price)
      VALUES (?,?,?,?,?,?,?)`, [name, description, categoryId, companyId, image, stock, price], (err, result) => {
            if (err)
                rej(err);
            (0, exports.getProduct)(result.insertId)
                .then((product) => res(product))
                .catch((err) => rej(err));
        });
    });
}
exports.storeProduct = storeProduct;
function updateProduct(id, product) {
    return new Promise((res, rej) => {
        const { name, description, categoryId, companyId, image, stock, price } = product;
        pool.query(`UPDATE product SET
      name=?,description=?,categoryId=?,companyId=?,image=?,stock=?,price=?
      WHERE id=?`, [name, description, categoryId, companyId, image, stock, price, id], (err, result) => {
            if (err)
                rej(err);
            (0, exports.getProduct)(id)
                .then((product) => res(product))
                .catch((err) => rej(err));
        });
    });
}
exports.updateProduct = updateProduct;
function removeProduct(id) {
    return new Promise((res, rej) => {
        pool.query("DELETE product WHERE id=?", [id], (err, result) => {
            if (err)
                rej(err);
            (0, exports.getProduct)(id)
                .then((product) => res(product))
                .catch((err) => rej(err));
        });
    });
}
exports.removeProduct = removeProduct;
function getProductReviews(productId) {
    return new Promise((res, rej) => {
        pool.query(`
    SELECT
      pr.*,
      u.userName as userName,
      u.email as userEmail,
      u.image as userImage,
      c.comment as comment
    FROM productReview pr
    LEFT JOIN user u ON u.userId = pr.userId
    LEFT JOIN comment c ON c.commentId = pr.commentId
    WHERE pr.productId=?`, [productId], (err, rows) => {
            if (err)
                rej(err);
            res(rows);
        });
    });
}
exports.getProductReviews = getProductReviews;
function getCommentImages(id) {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM commentImage WHERE commentId=?", [id], (err, rows) => {
            if (err)
                rej(err);
            res(rows);
        });
    });
}
exports.getCommentImages = getCommentImages;
function getCategories() {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM category", (err, rows) => {
            if (err)
                rej(err);
            res(rows);
        });
    });
}
exports.getCategories = getCategories;
function getCompanies() {
    return new Promise((res, rej) => {
        pool.query("SELECT * FROM company", (err, rows) => {
            if (err)
                rej(err);
            res(rows);
        });
    });
}
exports.getCompanies = getCompanies;
