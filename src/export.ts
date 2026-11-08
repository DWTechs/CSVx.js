import type { Options } from './interfaces';
import { isArray, isObject, isString } from '@dwtechs/checkard';

export namespace Export {

  // default option values
  export let options: Options = {
    data: 'text/csv',
    charset: 'utf-8',
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
    customLabels: null,
    save: false,
  };

  export async function data(
    filename: string,
    data: { [key: string]: number | string }[],
    options?: Partial<Options>
  ): Promise<boolean> {
    if (!isArray(data, '>', 0)) {
      return false;
    }

    // check data consistency
    for (const row of data) {
      if (!isObject(row)) {
        return false;
      }
    }

    const name = isString(filename, '!0') ? filename : 'export';
    const opts = resolveOptions(options);

    let table = '';
    let labels: string[] = [];
    let labelMap: { [key: string]: string };

    if (!opts.customLabels) {
      const generated = createLabels(data);
      labels = generated.labels;
      labelMap = generated.labelMap;
    } else {
      labelMap = opts.customLabels;
      labels = createCustomLabels(labelMap);
    }

    if (opts.labels) {
      table += createLabelsRow(labels, opts);
    }
    table += createTable(data, labelMap, opts);

    if (opts.save) {
      return await save(table, name, opts);
    }
    download(table, name, opts);
    return true;
  }

  export function setOptions(newOptions: Partial<Options>): void {
    if (!isObject(newOptions)) {
      return;
    }
    for (const property of Object.keys(newOptions)) {
      if (
        Object.prototype.hasOwnProperty.call(Export.options, property) &&
        newOptions[property] !== undefined
      ) {
        Export.options[property] = newOptions[property] as Options[keyof Options];
      }
    }
  }

  function resolveOptions(options?: Partial<Options>): Options {
    const resolved: Options = {
      ...Export.options,
      customLabels: Export.options.customLabels ? { ...Export.options.customLabels } : null,
    };
    if (isObject(options)) {
      for (const property of Object.keys(options)) {
        if (
          Object.prototype.hasOwnProperty.call(resolved, property) &&
          options[property] !== undefined
        ) {
          resolved[property] = options[property] as Options[keyof Options];
        }
      }
    }
    return resolved;
  }

  function download(table: string, filename: string, opts: Options): void {
    const link = document.createElement('a');
    let url: string;
    let isObjectUrl = false;

    if (
      typeof Blob !== 'undefined' &&
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function'
    ) {
      const blob = new Blob([table], { type: `${opts.data};charset=${opts.charset}` });
      url = URL.createObjectURL(blob);
      isObjectUrl = true;
    } else {
      url = `data:${opts.data};charset=${opts.charset},${encodeURIComponent(table)}`;
    }

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (isObjectUrl && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  }

  async function save(table: string, filename: string, opts: Options): Promise<boolean> {
    if (typeof window === 'undefined' || typeof (window as any).showSaveFilePicker !== 'function') {
      download(table, filename, opts);
      return true;
    }
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `${filename}.csv`,
      });
      const fileStream = await fileHandle.createWritable();
      await fileStream.write(
        new Blob([table], {
          type: `${opts.data};charset=${opts.charset}`,
          endings: 'native',
        })
      );
      await fileStream.close();
      return true;
    } catch {
      return false;
    }
  }

  function createTable(
    data: { [key: string]: number | string }[],
    labelMap: { [key: string]: string },
    opts: Options
  ): string {
    let table = '';
    const keys = Object.keys(labelMap);
    for (const row of data) {
      let parsedRow = '';
      for (const property of keys) {
        parsedRow += createField((row[property] as string | number) ?? '', opts);
      }
      table += createRow(parsedRow, opts);
    }
    return table;
  }

  function createLabels(
    data: { [key: string]: number | string }[]
  ): { labels: string[]; labelMap: { [key: string]: string } } {
    const params: string[] = [];
    for (const row of data) {
      let i = 0;
      for (const property of Object.keys(row)) {
        if (!params.includes(property)) {
          params.splice(i, 0, property);
        }
        i++;
      }
    }
    const labelMap: { [key: string]: string } = {};
    for (const param of params) {
      labelMap[param] = param;
    }
    return { labels: params, labelMap };
  }

  function createCustomLabels(customLabels: { [key: string]: string }): string[] {
    return Object.values(customLabels);
  }

  function createLabelsRow(labels: string[], opts: Options): string {
    let parsedRow = '';
    for (const label of labels) {
      parsedRow += createField(label, opts);
    }
    return createRow(parsedRow, opts);
  }

  function createRow(row: string, opts: Options): string {
    const sepLen = opts.separator.length;
    return (sepLen > 0 ? row.slice(0, -sepLen) : row) + opts.CRLF;
  }

  function createField(content: string | number, opts: Options): string {
    const str = String(content);
    const q = opts.quote;
    const escaped = q ? str.split(q).join(q + q) : str;
    return q + escaped + q + opts.separator;
  }

}
