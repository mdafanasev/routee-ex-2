export interface SearchResult {
  position: number;
  title: string;
  link: string;
  displayedLink: string;
  thumbnail: string;
  snippet: string;
}

export interface NewsEntry {
  position: number;
  title: string;
  link: string;
  source: string;
  date: string;
  thumbnail: string;
  snippet: string;
}
