import express from "express";
import productsRouter from "./routes/products";
import testRouter from "./routes/test";
import * as db from "./persistence";
import { PORT } from "../configuration";

const app = express();

app.use(express.json());
app.use(productsRouter);
app.use(testRouter);

db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`Server start on port ${PORT}...`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
