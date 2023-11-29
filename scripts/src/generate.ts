import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import fs from "fs";
import path from "path";
import {
  JSON_OUT_PATH,
  PLAINTEXT_OUT_PATH,
  OUT_PATH,
  FINAL_OUT_PATH,
  FINAL_OUTPUT_NAME,
} from "./configs.js";
import { Book, FinalOutput } from "./types.js";
import { writeFinalOutputToOutDir } from "./utils.js";
import book from "../out/json/books.json" assert { type: "json" };

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
  // Step 2: Get list of books from books.json
  const { data: books } = book;
  const pages: FinalOutput[] = [];

  // Step 3: Loop through each book
  books.forEach(({ slug }) => {
    // Step 4: Get book's content from each book file
    const fileData = fs.readFileSync(
      path.join(JSON_OUT_PATH, `book_${slug}.json`)
    );
    const book: Book = JSON.parse(fileData.toString());

    // Step 5: Loop through book's contents
    book.contents.forEach((content) => {
      // Books can either have page of chapter type
      if (content.type === "page") {
        // Step 5.1: Get page's description from text file
        const textPath = `${book.slug}_${content.slug}.txt`;
        const description = fs.readFileSync(
          path.join(PLAINTEXT_OUT_PATH, textPath),
          "utf-8"
        );

        pages.push({
          id: content.id,
          name: content.name,
          url: content.url,
          description,
        });
      } else if (content.type === "chapter") {
        // If book contain chapters, loop through chapters to get pages
        content.pages.forEach((page) => {
          // Step 5.1: Get page's description from text file
          const textPath = `${book.slug}_${content.slug}_${page.slug}.txt`;
          const description = fs.readFileSync(
            path.join(PLAINTEXT_OUT_PATH, textPath),
            "utf-8"
          );

          pages.push({
            id: content.id,
            name: content.name,
            url: content.url,
            description,
          });
        });
      } else {
        throw new Error("Undefined book content type");
      }
    });
  });

  writeFinalOutputToOutDir(pages, FINAL_OUTPUT_NAME);
} catch (err) {
  console.error("Error: ", err);
}
