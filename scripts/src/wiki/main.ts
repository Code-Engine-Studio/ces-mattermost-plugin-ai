// CES Brains conf
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { api } from "./api.js";
import { JSON_OUT_PATH, PLAINTEXT_OUT_PATH, OUT_PATH } from "../configs.js";
import { sleep, writeJsonToOutDir, writePlaintextToOutDir } from "../utils.js";

// Step 1: Create out dirs
if (!existsSync(OUT_PATH)) {
  await mkdir(OUT_PATH);
}

if (!existsSync(JSON_OUT_PATH)) {
  await mkdir(JSON_OUT_PATH);
}

if (!existsSync(PLAINTEXT_OUT_PATH)) {
  await mkdir(PLAINTEXT_OUT_PATH);
}

try {
  let countPage = 0;
  // Step 2: List books
  const listBooksRes = await api.listBooks();

  const books = await listBooksRes.json();

  await writeJsonToOutDir({ value: books, name: "books.json" });
  console.info("Fetched wiki books");
  console.info("----------------------------------------");

  // Step 3: Loop through each books
  for (const book of books.data) {
    let countPagesOfEachBooks = 0;
    await sleep(1000); // Avoid HTTP 429 - rate limit

    const bookDataRes = await api.readBook(book.id);
    const bookData = await bookDataRes.json();

    await writeJsonToOutDir({
      value: bookData,
      name: `book_${book.slug}.json`,
    });
    console.info(`Fetched book: ${book.name}`);

    // Books can either have page of chapter type
    for (const bookContent of bookData.contents) {
      await sleep(750); // Avoid HTTP 429 - rate limit

      // Step 4.1: Export pages
      if (bookContent.type === "page") {
        const pageResponse = await api.exportPageAsPlaintext(bookContent.id);

        await writePlaintextToOutDir({
          value: await pageResponse.text(),
          name: `${bookData.slug}_${bookContent.slug}`,
        });

        console.info(`\tFetched page: ${bookContent.name}`);
        countPagesOfEachBooks++;
        await sleep(500); // Avoid HTTP 429 - rate limit

        // Step 4.2: If book contain chapters, loop through chapters to get pages
      } else if (bookContent.type === "chapter") {
        // Step 4.2.1: Export pages
        for (const page of bookContent.pages) {
          const pageResponse = await api.exportPageAsPlaintext(page.id);

          await writePlaintextToOutDir({
            value: await pageResponse.text(),
            name: `${bookData.slug}_${bookContent.slug}_${page.slug}`,
          });

          console.info(`\tFetched page: ${page.name}`);
          countPagesOfEachBooks++;
          await sleep(500); // Avoid HTTP 429 - rate limit
        }
      } else {
        throw new Error("Undefined book content type: ", bookContent.type);
      }
    }

    countPage += countPagesOfEachBooks;
    console.info(`${book.name} has ${countPagesOfEachBooks} pages`);
    console.info("----------------------------------------");
  }

  console.info(`Total pages in wiki: ${countPage}`);
} catch (err) {
  console.error("Error: ", err);
}
