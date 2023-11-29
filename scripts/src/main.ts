// CES Brains conf
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { api } from "./api.js";
import {
  JSON_OUT_PATH,
  PLAINTEXT_OUT_PATH,
  OUT_PATH,
  FINAL_OUT_PATH,
  FINAL_OUTPUT_NAME,
} from "./configs.js";
import {
  sleep,
  writeJsonToOutDir,
  writePlaintextToOutDir,
  writeFinalOutputToOutDir,
  sanitizeText,
} from "./utils.js";
import { FinalOutput } from "./types.js";

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

if (!existsSync(FINAL_OUT_PATH)) {
  await mkdir(FINAL_OUT_PATH);
}

try {
  const pages: FinalOutput[] = [];
  // Step 2: List books
  const listBooksRes = await api.listBooks();

  const books = await listBooksRes.json();

  await writeJsonToOutDir(books, "books.json");
  console.info("Fetched wiki books");
  console.info("----------------------------------------");

  // Step 3: Loop through each books
  for (const book of books.data) {
    let countPagesOfEachBooks = 0;
    await sleep(1000); // Avoid HTTP 429 - rate limit

    const bookDataRes = await api.readBook(book.id);
    const bookData = await bookDataRes.json();

    await writeJsonToOutDir(bookData, `book_${book.slug}.json`);
    console.info(`Fetched book: ${book.name}`);

    // Books can either have page of chapter type
    for (const bookContent of bookData.contents) {
      await sleep(750); // Avoid HTTP 429 - rate limit

      // Step 4.1: Export pages
      if (bookContent.type === "page") {
        const pageResponse = await api.exportPageAsPlaintext(bookContent.id);

        const pagePlainText = await pageResponse.text();
        const sanitizedText = sanitizeText(pagePlainText);

        await writePlaintextToOutDir(
          sanitizedText,
          `${bookData.slug}_${bookContent.slug}`
        );

        pages.push({
          id: bookContent.id,
          name: bookContent.name,
          url: bookContent.url,
          description: sanitizedText,
        });

        console.info(`\tFetched page: ${bookContent.name}`);
        countPagesOfEachBooks++;
        await sleep(500); // Avoid HTTP 429 - rate limit

        // Step 4.2: If book contain chapters, loop through chapters to get pages
      } else if (bookContent.type === "chapter") {
        // Step 4.2.1: Export pages
        for (const page of bookContent.pages) {
          const pageResponse = await api.exportPageAsPlaintext(page.id);

          const pagePlainText = await pageResponse.text();
          const sanitizedText = sanitizeText(pagePlainText);

          await writePlaintextToOutDir(
            sanitizedText,
            `${bookData.slug}_${bookContent.slug}_${page.slug}`
          );

          pages.push({
            id: page.id,
            name: page.name,
            url: page.url,
            description: sanitizedText,
          });

          console.info(`\tFetched page: ${page.name}`);
          countPagesOfEachBooks++;
          await sleep(500); // Avoid HTTP 429 - rate limit
        }
      } else {
        throw new Error("Undefined book content type: ", bookContent.type);
      }
    }

    console.info(`${book.name} has ${countPagesOfEachBooks} pages`);
    console.info("----------------------------------------");
  }

  await writeFinalOutputToOutDir(pages, FINAL_OUTPUT_NAME);
  console.info(`Total pages in wiki: ${pages.length}`);
} catch (err) {
  console.error("Error: ", err);
}
