import type { Options } from './interfaces';
import { isArray, isObject, isString } from '@dwtechs/checkard';

interface WritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandleLike {
  createWritable(): Promise<WritableFileStream>;
}

interface SaveFilePickerWindow extends Window {
  showSaveFilePicker?: (options?: { suggestedName?: string }) => Promise<FileSystemFileHandleLike>;
}

const UTF8_BOM = '\uFEFF';

function resolveOptions(options?: Partial<Options>): Options {
  const resolved: Options = {
    ...Export.options,
    customLabels: Export.options.customLabels ? { ...Export.options.customLabels } : null,
  };
  if (isObject(options)) {
    for (const property of Object.keys(options)) {
      if (Object.hasOwn(resolved, property) && options[property] !== undefined) {
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
  const pickerWindow = window as SaveFilePickerWindow;
  if (typeof window === 'undefined' || typeof pickerWindow.showSaveFilePicker !== 'function') {
    download(table, filename, opts);
    return true;
  }
  try {
    const fileHandle = await pickerWindow.showSaveFilePicker({
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

function createField(content: string | number, opts: Options): string {
  const str = String(content);
  const q = opts.quote;
  const escaped = q ? str.replaceAll(q, q + q) : str;
  return q + escaped + q + opts.separator;
}

function createRow(row: string, opts: Options): string {
  const sepLen = opts.separator.length;
  return (sepLen > 0 ? row.slice(0, -sepLen) : row) + opts.CRLF;
}

function createLabelsRow(labels: string[], opts: Options): string {
  let parsedRow = '';
  for (const label of labels) {
    parsedRow += createField(label, opts);
  }
  return createRow(parsedRow, opts);
}

function createCustomLabels(customLabels: Record<string, string>): string[] {
  return Object.values(customLabels);
}

function createLabels(
  data: Record<string, number | string>[]
): { labels: string[]; labelMap: Record<string, string> } {
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
  const labelMap: Record<string, string> = {};
  for (const param of params) {
    labelMap[param] = param;
  }
  return { labels: params, labelMap };
}

function createTable(
  data: Record<string, number | string>[],
  labelMap: Record<string, string>,
  opts: Options
): string {
  let table = '';
  const keys = Object.keys(labelMap);
  for (const row of data) {
    let parsedRow = '';
    for (const property of keys) {
      parsedRow += createField(row[property] ?? '', opts);
    }
    table += createRow(parsedRow, opts);
  }
  return table;
}

/**
 * CSV export utilities for serializing arrays of objects and downloading or saving `.csv` files.
 */
export const Export = {

  /** Default export options. */
  options: {
    data: 'text/csv',
    charset: 'utf-8',
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
    customLabels: null,
    save: false,
    bom: false,
  } as Options,

  /**
   * Exports an array of plain objects as a `.csv` file.
   *
   * @param filename - Output file name (without `.csv` extension; defaults to `'export'` if empty).
   * @param data - Non-empty array of plain objects to serialize.
   * @param options - Optional per-call overrides for export options.
   * @returns `true` if the export succeeded, `false` if validation failed or the save dialog was cancelled.
   */
  async data(
    filename: string,
    data: Record<string, number | string>[],
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

    let table = opts.bom ? UTF8_BOM : '';
    let labels: string[] = [];
    let labelMap: Record<string, string>;

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
  },

  /**
   * Updates the persistent default export options on `Export.options`.
   *
   * @param newOptions - Partial options to merge into `Export.options`.
   */
  setOptions(newOptions: Partial<Options>): void {
    if (!isObject(newOptions)) {
      return;
    }
    for (const property of Object.keys(newOptions)) {
      if (Object.hasOwn(Export.options, property) && newOptions[property] !== undefined) {
        Export.options[property] = newOptions[property] as Options[keyof Options];
      }
    }
  },

};
