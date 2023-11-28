import { WIKI_CONFIGS } from "../configs.js";

const buildClient = (path: string) =>
  fetch(new URL(path, WIKI_CONFIGS.WIKI_API_BASE_URL).href, {
    headers: {
      Authorization: `Token ${WIKI_CONFIGS.TOKEN_ID}:${WIKI_CONFIGS.TOKEN_SECRET}`,
    },
  });

export const api = {
  listBooks: () => buildClient("books"),
  readBook: (id: string) => buildClient(`books/${id}`),
  exportPageAsPlaintext: (id: string) =>
    buildClient(`pages/${id}/export/plaintext`),
};
