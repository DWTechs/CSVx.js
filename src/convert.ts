import type { Options, CSS } from './interfaces';
import { isObject, isString } from '@dwtechs/checkard';

export type CellTypes = 'td' | 'th';

export namespace Convert {

  // default option values
  export let options: Partial<Options> = {
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
  };

  export let css: CSS = {
    table: '',
    th: '',
  };

  export function setOptions(newOptions: Partial<Options>): void {
    setObject('options', newOptions);
  }

  export function setCSS(newCSS: Partial<CSS>): void {
    setObject('css', newCSS);
  }

  export function array(
    data: string,
    options?: Partial<Options>
  ): Array<Array<string>> | false {
    if (!isString(data, '!0')) {
      return false;
    }

    const opts = resolveObject(Convert.options, options);
    const crlf = opts.CRLF as string;
    const separator = opts.separator as string;
    const quote = opts.quote as string;

    const rows: Array<string> = data.trim().split(crlf).filter(Boolean);
    if (!rows.length) {
      return false;
    }

    const array: Array<Array<string>> = [];

    for (const row of rows) {
      const cells: Array<string> = row.split(separator);
      if (quote) {
        const qLen = quote.length;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (cell.length >= qLen * 2 && cell.startsWith(quote) && cell.endsWith(quote)) {
            cells[i] = cell.slice(qLen, -qLen).split(quote + quote).join(quote);
          }
        }
      }
      array.push(cells);
    }
    return array;
  }

  export function table(
    data: string,
    options?: Partial<Options>,
    css?: Partial<CSS>
  ): string | false {
    const opts = resolveObject(Convert.options, options);
    const cssOpts = resolveObject(Convert.css, css);

    const rows = Convert.array(data, opts);
    if (rows) {
      let thead = '';
      const table: Array<string> = [];
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
  }

  function createTr(row: Array<string>, cellType: CellTypes, style: string): string {
    const escapedCells = row.map(cell => escapeHtml(cell));
    return (
      `<tr><${cellType}${style}>` +
      escapedCells.join(`</${cellType}><${cellType}${style}>`) +
      `</${cellType}></tr>`
    );
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveObject<T extends Record<string, any>>(
    base: T,
    overrides?: Partial<T>
  ): T {
    const resolved = { ...base };
    if (isObject(overrides)) {
      for (const property of Object.keys(overrides)) {
        if (
          Object.prototype.hasOwnProperty.call(resolved, property) &&
          overrides[property] !== undefined
        ) {
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
      if (
        Object.prototype.hasOwnProperty.call(Convert[parameterName], property) &&
        newObject[property] !== undefined
      ) {
        Convert[parameterName][property] = newObject[property] as any;
      }
    }
  }

}
