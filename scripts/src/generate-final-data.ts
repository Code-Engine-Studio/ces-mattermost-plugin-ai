import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import book from "../out/json/books.json" assert { type: "json" };
import {
  FINAL_DATA_FILENAME,
  FINAL_DATA_OUT_PATH,
  JSON_OUT_PATH,
  OUT_PATH,
  PLAINTEXT_OUT_PATH,
} from "./configs.js";
import { Book, FinalData } from "./types.js";
import { writeFinalData } from "./utils.js";

// Step 1: Create out dirs
if (!existsSync(OUT_PATH)) {
  await mkdir(OUT_PATH);
}

if (!existsSync(FINAL_DATA_OUT_PATH)) {
  await mkdir(FINAL_DATA_OUT_PATH, {
    recursive: true,
  });
}

try {
  // Step 2: Get list of books from books.json
  const { data: books } = book;
  const pages: FinalData[] = [];

  // Step 3: Loop through each book
  books.forEach(({ slug }) => {
    // Step 4: Get book's content from each book file
    const fileData = readFileSync(
      path.join(JSON_OUT_PATH, `book_${slug}.json`)
    );
    const book: Book = JSON.parse(fileData.toString());

    // Step 5: Loop through book's contents
    book.contents.forEach((content) => {
      // Books can either have page of chapter type
      if (content.type === "page") {
        // Step 5.1: Get page's description from text file
        const textPath = `${book.slug}_${content.slug}.txt`;
        const description = readFileSync(
          path.join(PLAINTEXT_OUT_PATH, textPath),
          "utf-8"
        );

        pages.push({
          id: pages.length + 1,
          title: content.name,
          url: content.url,
          description,
        });
      } else if (content.type === "chapter") {
        // If book contain chapters, loop through chapters to get pages
        content.pages.forEach((page) => {
          // Step 5.1: Get page's description from text file
          const textPath = `${book.slug}_${content.slug}_${page.slug}.txt`;
          const description = readFileSync(
            path.join(PLAINTEXT_OUT_PATH, textPath),
            "utf-8"
          );

          pages.push({
            id: pages.length + 1,
            title: content.name,
            url: content.url,
            description,
          });
        });
      } else {
        throw new Error("Undefined book content type");
      }
    });
  });

  writeFinalData({
    value: pages.sort((a, b) => a.id - b.id),
    filename: FINAL_DATA_FILENAME,
  });
} catch (err) {
  console.error("Error: ", err);
}
