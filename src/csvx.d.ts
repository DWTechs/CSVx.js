export type CellTypes = 'td' | 'th';

export interface Options {
  data: string;
  charset: string;
  labels: boolean;
  quote: string;
  separator: string;
  CRLF: string;
  customLabels: { [key: string]: string } | null;
  save: boolean;
  [key: string]: string[] | string | boolean | { [key: string]: string } | null;
}

export interface CSS {
  table: string;
  th: string;
  [key: string]: string;
}

export declare namespace Convert {
  let options: Partial<Options>;
  let css: CSS;
  function setOptions(options: Partial<Options>): void;
  function setCSS(css: Partial<CSS>): void;
  function array(
    data: string,
    options?: Partial<Options>
  ): Array<Array<string>> | false;
  function table(
    data: string,
    options?: Partial<Options>,
    css?: Partial<CSS>
  ): string | false;
}

export declare namespace Export {
  let options: Options;
  function data(
    filename: string,
    data: { [key: string]: number | string }[],
    options?: Partial<Options>
  ): Promise<boolean>;
  function setOptions(options: Partial<Options>): void;
}
