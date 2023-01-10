import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import testRouter from "./routes/test.js";
import * as db from "./persistence/index.js";
import { PORT } from "../configuration/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(productsRouter);
app.use(testRouter);

db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`Server start on port ${PORT}...`));
  })
  .catch((err) => {
    console.error(err + "");
    process.exit(1);
  });
