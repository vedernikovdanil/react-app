import fs from "fs/promises";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.UNSPLASH_SERCRET_KEY;

const page = 1;

let i = 30 * (page - 1) + 1;

async function loadPage(search, page, by = 30, idStart) {
  const url = "https://api.unsplash.com/search/photos";
  const accessKey = SECRET_KEY;
  const query = `page=${page}&query=${search}&per_page=${by}`;

  await fetch(`${url}?client_id=${accessKey}&${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((res) => {
        fetch(res.urls.small)
          .then((x) => x.arrayBuffer())
          .then((x) =>
            fs.writeFile(`images/${search}${idStart++}.jpg`, Buffer.from(x))
          )
          .catch((err) => console.error(err));
      });
    });
}

async function loadPages(search, pages) {
  for (let page = 1; page <= pages; ++page) {
    let i = 30 * (page - 1) + 1;
    await loadPage(search, page, 30, i);
  }
}

loadPages("real-estate", 3);
