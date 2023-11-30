import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  EMBEDDINGS_FILENAME,
  EMBEDDINGS_OUT_PATH,
  FINAL_DATA_FILENAME,
  FINAL_DATA_OUT_PATH,
  BOOKS_OUT_PATH,
  PAGES_OUT_PATH,
} from "./configs.js";

type WriteFileInput<T = unknown> = {
  value: T;
  filename: string;
};

type WriteFileWithPathInput = WriteFileInput & {
  folderPath: string;
};

export const writePlaintextToOutDir = ({
  filename,
  value,
}: WriteFileInput<string>) => {
  let finalFilename = filename;

  if (!finalFilename.endsWith(".txt")) {
    finalFilename = finalFilename.concat(".txt");
  }

  return writeFile(path.join(PAGES_OUT_PATH, finalFilename), value, {
    encoding: "utf8",
  });
};

export const writeJsonFile = ({
  value,
  filename,
  folderPath,
}: WriteFileWithPathInput) => {
  let name = filename;

  if (!name.endsWith(".json")) {
    name = name.concat(".json");
  }

  return writeFile(
    path.join(folderPath, name),
    JSON.stringify(value, null, 2),
    {
      encoding: "utf8",
    }
  );
};

export const writeBook = ({ filename, value }: WriteFileInput) =>
  writeJsonFile({ value, filename, folderPath: BOOKS_OUT_PATH });

export const writeFinalData = ({ value }: Omit<WriteFileInput, "filename">) =>
  writeJsonFile({
    value,
    filename: FINAL_DATA_FILENAME,
    folderPath: FINAL_DATA_OUT_PATH,
  });

export const writeEmbeddings = ({ value }: Omit<WriteFileInput, "filename">) =>
  writeJsonFile({
    value,
    filename: EMBEDDINGS_FILENAME,
    folderPath: EMBEDDINGS_OUT_PATH,
  });

export const sanitizeText = (value: string) =>
  value
    .replace(/(\u00A0)/g, " ")
    .replace(/(\n{2,})/g, "\n")
    .replace(/(\s{2,})/g, " ")
    .trim();

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
