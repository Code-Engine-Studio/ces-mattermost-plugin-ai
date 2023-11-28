import { writeFile } from "node:fs/promises";
import path from "node:path";
import { JSON_OUT_PATH, PLAINTEXT_OUT_PATH } from "./configs.js";

type WriteFileInput<T = unknown> = {
  value: T;
  name: string;
};

export const writeJsonToOutDir = ({ name, value }: WriteFileInput) => {
  let fileName = name;

  if (!name.endsWith(".json")) {
    fileName = fileName.concat(".json");
  }

  return writeFile(
    path.join(JSON_OUT_PATH, fileName),
    JSON.stringify(value, null, 2),
    {
      encoding: "utf8",
    }
  );
};

export const writePlaintextToOutDir = ({
  name,
  value,
}: WriteFileInput<string>) => {
  let fileName = name;

  if (!name.endsWith(".txt")) {
    fileName = fileName.concat(".txt");
  }

  return writeFile(path.join(PLAINTEXT_OUT_PATH, fileName), value, {
    encoding: "utf8",
  });
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
