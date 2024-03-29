
export interface Options {
  data: string;
  charset: string;
  labels: boolean;
  quote: string;
  separator: string;
  CRLF: string;
  customLabels: { [key: string]: string }|null;
  save: boolean;
  [key: string]: string[]|String|boolean|{ [key: string]: string }|null;
}

export interface CSS {
  table: string;
  th: string;
  [key: string]: String;
}