export interface Book {
  tittel: string;
  forfatter: string;
  sjanger: string;
  spraak: string;
  eierform: string;
  kjoept: string;
  eier: string;
  notater: string;
  lestNora: boolean;
  lestSara: boolean;
}

export type SortField = 'tittel' | 'forfatter' | 'sjanger' | 'spraak';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'library' | 'stats';
