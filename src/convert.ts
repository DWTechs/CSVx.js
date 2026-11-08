import type { Options, CSS } from './interfaces';
import { isObject, isString } from '@dwtechs/checkard';

/** HTML table cell tag names. */
export type CellTypes = 'td' | 'th';

function escapeHtml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createTr(row: string[], cellType: CellTypes, style: string): string {
  const escapedCells = row.map(cell => escapeHtml(cell));
  return (
    `<tr><${cellType}${style}>` +
    escapedCells.join(`</${cellType}><${cellType}${style}>`) +
    `</${cellType}></tr>`
  );
}

function resolveObject<T extends Record<string, unknown>>(
  base: T,
  overrides?: Partial<T>
): T {
  const resolved = { ...base };
  if (isObject(overrides)) {
    for (const property of Object.keys(overrides)) {
      if (Object.hasOwn(resolved, property) && overrides[property] !== undefined) {
        (resolved as Record<string, unknown>)[property] = overrides[property];
      }
    }
  }
  return resolved;
}

function setObject(
  parameterName: 'options' | 'css',
  newObject: Partial<Options | CSS>
): void {
  if (!isObject(newObject)) {
    return;
  }
  for (const property of Object.keys(newObject)) {
    if (Object.hasOwn(Convert[parameterName], property) && newObject[property] !== undefined) {
      (Convert[parameterName] as Record<string, unknown>)[property] = newObject[property];
    }
  }
}

/**
 * CSV conversion utilities for transforming raw CSV strings into 2D arrays or HTML tables.
 */
export const Convert = {

  /** Default conversion options. */
  options: {
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
  } as Partial<Options>,

  /** Default CSS classes applied by `Convert.table()`. */
  css: {
    table: '',
    th: '',
  } as CSS,

  /**
   * Updates the persistent default conversion options on `Convert.options`.
   *
   * @param newOptions - Partial options to merge into `Convert.options`.
   */
  setOptions(newOptions: Partial<Options>): void {
    setObject('options', newOptions);
  },

  /**
   * Updates the persistent default CSS class names on `Convert.css`.
   *
   * @param newCSS - Partial CSS configuration to merge into `Convert.css`.
   */
  setCSS(newCSS: Partial<CSS>): void {
    setObject('css', newCSS);
  },

  /**
   * Parses a CSV string into a 2D array of cell strings.
   *
   * @param data - Raw CSV string to parse.
   * @param options - Optional per-call overrides for conversion options.
   * @returns A 2D array of rows and cells, or `false` if `data` is not a non-empty string.
   */
  array(
    data: string,
    options?: Partial<Options>
  ): string[][] | false {
    if (!isString(data, '!0')) {
      return false;
    }

    const opts = resolveObject(Convert.options, options);
    const crlf = opts.CRLF as string;
    const separator = opts.separator as string;
    const quote = opts.quote as string;

    const cleaned = data.startsWith('\uFEFF') ? data.slice(1) : data;
    const rows: string[] = cleaned.trim().split(crlf).filter(Boolean);
    if (!rows.length) {
      return false;
    }

    const array: string[][] = [];

    for (const row of rows) {
      const cells: string[] = row.split(separator);
      if (quote) {
        const qLen = quote.length;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (cell.length >= qLen * 2 && cell.startsWith(quote) && cell.endsWith(quote)) {
            cells[i] = cell.slice(qLen, -qLen).replaceAll(quote + quote, quote);
          }
        }
      }
      array.push(cells);
    }
    return array;
  },

  /**
   * Converts a CSV string into an HTML `<table>` string.
   *
   * @param data - Raw CSV string to convert.
   * @param options - Optional per-call overrides for conversion options.
   * @param css - Optional per-call CSS classes for `<table>` and `<th>` elements.
   * @returns HTML `<table>` string, or `false` if `data` is invalid.
   */
  table(
    data: string,
    options?: Partial<Options>,
    css?: Partial<CSS>
  ): string | false {
    const opts = resolveObject(Convert.options, options);
    const cssOpts = resolveObject(Convert.css, css);

    const rows = Convert.array(data, opts);
    if (rows) {
      let thead = '';
      const table: string[] = [];
      for (let i = 0; i < rows.length; i++) {
        let cellType: CellTypes = 'td';
        let style = '';
        if (!i && opts.labels) {
          cellType = 'th';
          if (cssOpts.th) {
            style = ` class="${escapeHtml(cssOpts.th)}"`;
          }
          thead = `<thead>${createTr(rows[i], cellType, style)}</thead>`;
        } else {
          table.push(createTr(rows[i], cellType, ''));
        }
      }

      const style = cssOpts.table ? ` class="${escapeHtml(cssOpts.table)}"` : '';
      return `<table${style}>${thead}<tbody>${table.join('')}</tbody></table>`;
    }
    return false;
  },

};
