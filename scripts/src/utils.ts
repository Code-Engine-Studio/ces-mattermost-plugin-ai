import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  JSON_OUT_PATH,
  PLAINTEXT_OUT_PATH,
  FINAL_OUT_PATH,
} from "./configs.js";

export const writePlaintextToOutDir = (value: string, name: string) => {
  let fileName = name;

  if (!name.endsWith(".txt")) {
    fileName = fileName.concat(".txt");
  }

  return writeFile(path.join(PLAINTEXT_OUT_PATH, fileName), value, {
    encoding: "utf8",
  });
};

export const writeJsonToOutDir = (value: any, name: string) =>
  writeJSonFile(value, name, JSON_OUT_PATH);

export const writeFinalOutputToOutDir = (value: any, name: string) =>
  writeJSonFile(value, name, FINAL_OUT_PATH);

export const writeJSonFile = (value: any, name: string, folderPath: string) => {
  let fileName = name;

  if (!name.endsWith(".json")) {
    fileName = fileName.concat(".json");
  }

  return writeFile(
    path.join(folderPath, fileName),
    JSON.stringify(value, null, 2),
    {
      encoding: "utf8",
    }
  );
};

export const sanitizeText = (value: string) =>
  value
    .replace(/(\u00A0)/g, " ")
    .replace(/(\n{2,})/g, "\n")
    .replace(/(\s{2,})/g, " ")
    .trim();

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
