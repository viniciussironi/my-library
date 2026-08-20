export type SortOption =
  | "title_asc"
  | "title_desc"
  | "added_desc"
  | "added_asc"
  | "lastAccess_desc"
  | "lastAccess_asc";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "added_desc", label: "Adicionados recentemente" },
  { value: "lastAccess_desc", label: "Acessados recentemente" },
  { value: "title_asc", label: "Título (A-Z)" },
  { value: "title_desc", label: "Título (Z-A)" },
];