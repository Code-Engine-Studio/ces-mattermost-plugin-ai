export interface Book {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: User | null;
  updated_by: User | null;
  owned_by: User | null;
  contents: (Chapter | Page)[];
}

export interface User {
  id: number;
  name: string;
  slug: string;
}

export interface Chapter {
  id: number;
  name: string;
  slug: string;
  book_id: number;
  priority: number;
  created_at: string;
  updated_at: string;
  url: string;
  type: "chapter";
  pages: Page[];
}

export interface Page {
  id: number;
  name: string;
  slug: string;
  book_id: number;
  chapter_id: number;
  draft: boolean;
  template: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  url: string;
  type: "page";
}

export interface FinalData {
  id: number;
  title: string;
  url: string;
  description: string;
}
