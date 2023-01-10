import Chance from "chance";
import _ from "lodash";

const chance = new Chance();

const getRandomId = (array) => {
  const id = Math.round(Math.random() * (array.length - 1)) + 1;
  if (id <= 0 || id > array.length) {
    throw new Error("id is wrong " + id);
  }
  return id;
};
const getRandom = (array) => {
  return array[Math.round(Math.random() * (array.length - 1))];
};
const getInstances = (func, count) => {
  return Array(count)
    .fill()
    .map(() => new func());
};
function toSQLValues(array) {
  return array
    .map(
      (item) =>
        `(${Object.values(item)
          .map((val) => `'${val}'`)
          .join(", ")})`
    )
    .join(",\n");
}
function toSQLDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

class RealEstate {
  static #id = 1;
  id = RealEstate.#id++;
  street = chance.street();
  houseNumber = Math.round(Math.random() * (1000 - 1)) + 1;
  storeys = Math.round(Math.random() * (25 - 1)) + 1;
  square = (Math.random() * 1e3).toFixed(2);
  pricePerSq = (Math.random() * (1e6 - 2)).toFixed(2) + 1;
  agency = chance.company();
  agencyAddress = chance.address();
  photo = `real-estate${this.id}`;
}
const realEstates = getInstances(RealEstate, 90);

console.log("INSERT INTO realEstate VALUES");
console.log(toSQLValues(realEstates));

// let companyId = 1;
// const companies = chance
//   .unique(chance.company, 25)
//   .map((c) => ({ id: companyId++, name: c }));

// let categoryId = 1;
// const categories = [
//   "television",
//   "smartphone",
//   "laptop",
//   "game",
//   "accessories",
//   "other",
// ].map((cName) => ({ id: categoryId++, name: cName, i: 1 }));

class User {
  static #id = 1;
  userId = User.#id++;
  userName = chance.twitter().slice(1);
  email = chance.email();
}
// const users = getInstances(User, 100);

class Comment {
  static #id = 1;
  commentId = Comment.#id++;
  comment = chance.paragraph();
}
// const comments = getInstances(Comment, 100);

class Product {
  static #id = 1;
  #category = getRandom(categories);
  productId = Product.#id++;
  name = chance.sentence();
  description = chance.paragraph();
  categoryId = this.#category.id;
  companyId = getRandomId(companies);
  image = this.#category.name + this.#category.i++;
  stock = Math.random() > 0.5 ? Math.round(Math.random() * 999) : 0;
  price = (Math.random() * (1e6 - 1)).toFixed(2);
}
// const products = getInstances(Product, 500);

class ProductReview {
  static #id = 1;
  static #commentIdList = [];
  #commentId = getRandomId(comments);
  productReviewId = ProductReview.#id++;
  productId = getRandomId(products);
  userId = getRandomId(users);
  commentId = ProductReview.getDistinctCommentId(this.#commentId);
  rate = (Math.random() * (5 - 1) + 1).toFixed(2);
  constructor() {
    if (this.commentId) {
      ProductReview.#commentIdList.push(this.commentId);
    }
  }
  static getDistinctCommentId(commentId) {
    return Math.random() > 0.75 &&
      ProductReview.#commentIdList.findIndex((c) => c == commentId) === -1
      ? commentId
      : null;
  }
}
// const productReviews = getInstances(ProductReview, 1000);

// console.log("\n\n--USERS\n");
// console.log(toSQLValues(users));
// console.log("\n\n--CATEGORIES\n");
// console.log(toSQLValues(categories));
// console.log("\n\n--COMPANIES\n");
// console.log(toSQLValues(companies));
// console.log("\n\n--COMMENTS\n");
// console.log(toSQLValues(comments));
// console.log("\n\n--PRODUCTS\n");
// console.log(toSQLValues(products));
// console.log("\n\n--PRODUCT_REVIEWS\n");
// console.log(toSQLValues(productReviews));
