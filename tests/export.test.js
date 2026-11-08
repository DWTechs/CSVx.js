import { Export } from '../dist/csvx.js';

const scientists = [
  {
    firstname: 'Galileo',
    lastname: 'Galiléi',
    born: 1564,
    died: 1642,
  },
  {
    firstname: 'Nikola',
    lastname: 'Tesla',
    city: 'Smiljan',
    born: 1856,
    died: 1943,
  },
];

const customLabels = {
  firstname: 'First name',
  lastname: 'Last name',
  city: 'City',
  born: 'Born',
  died: 'Died',
};

describe('Export', () => {
  let capturedBlobs = [];
  let clickedLinks = [];
  let origCreateObjectURL;
  let origRevokeObjectURL;

  beforeEach(() => {
    capturedBlobs = [];
    clickedLinks = [];

    // Reset static options to defaults before each test
    Export.options = {
      data: 'text/csv',
      charset: 'utf-8',
      labels: true,
      quote: '"',
      separator: ',',
      CRLF: '\r\n',
      customLabels: null,
      save: false,
    };

    origCreateObjectURL = URL.createObjectURL;
    origRevokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = jest.fn(blob => {
      capturedBlobs.push(blob);
      return 'blob:https://example.com/mock-csv';
    });
    URL.revokeObjectURL = jest.fn();

    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      clickedLinks.push({
        href: this.getAttribute('href'),
        download: this.getAttribute('download'),
      });
    });

    delete window.showSaveFilePicker;
  });

  afterEach(() => {
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;
    jest.restoreAllMocks();
  });

  const readBlobText = blob =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(blob, 'utf-8');
    });

  describe('input validation', () => {
    test('returns false when data is not an array or is empty', async () => {
      expect(await Export.data('test', null)).toBe(false);
      expect(await Export.data('test', undefined)).toBe(false);
      expect(await Export.data('test', 'not-an-array')).toBe(false);
      expect(await Export.data('test', 123)).toBe(false);
      expect(await Export.data('test', {})).toBe(false);
      expect(await Export.data('test', [])).toBe(false);
    });

    test('returns false when any row in data is not a plain object', async () => {
      expect(await Export.data('test', [null])).toBe(false);
      expect(await Export.data('test', [{ a: 1 }, 'invalid'])).toBe(false);
      expect(await Export.data('test', [{ a: 1 }, [1, 2]])).toBe(false);
    });
  });

  describe('CSV generation and download', () => {
    test('exports CSV with auto-detected labels across heterogeneous rows', async () => {
      const result = await Export.data('scientists', scientists);
      expect(result).toBe(true);
      expect(clickedLinks).toHaveLength(1);
      expect(clickedLinks[0].download).toBe('scientists.csv');
      expect(clickedLinks[0].href).toBe('blob:https://example.com/mock-csv');
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.com/mock-csv');

      const csvText = await readBlobText(capturedBlobs[0]);
      expect(csvText).toBe(
        '"firstname","lastname","city","born","died"\r\n' +
          '"Galileo","Galiléi","","1564","1642"\r\n' +
          '"Nikola","Tesla","Smiljan","1856","1943"\r\n'
      );
    });

    test('defaults filename to "export.csv" when filename is empty or invalid', async () => {
      await Export.data('', [{ a: 1 }]);
      expect(clickedLinks[0].download).toBe('export.csv');

      await Export.data(null, [{ a: 1 }]);
      expect(clickedLinks[1].download).toBe('export.csv');
    });

    test('uses customLabels when provided', async () => {
      const result = await Export.data('scientists', scientists, {
        separator: ';',
        customLabels,
      });
      expect(result).toBe(true);

      const csvText = await readBlobText(capturedBlobs[0]);
      expect(csvText).toBe(
        '"First name";"Last name";"City";"Born";"Died"\r\n' +
          '"Galileo";"Galiléi";"";"1564";"1642"\r\n' +
          '"Nikola";"Tesla";"Smiljan";"1856";"1943"\r\n'
      );
    });

    test('does not leak auto-generated or per-call customLabels to subsequent calls', async () => {
      await Export.data('first', [{ colA: 'valA', colB: 'valB' }]);
      await Export.data('second', [{ colX: 'valX', colY: 'valY' }]);

      const firstCsv = await readBlobText(capturedBlobs[0]);
      const secondCsv = await readBlobText(capturedBlobs[1]);

      expect(firstCsv).toBe('"colA","colB"\r\n"valA","valB"\r\n');
      expect(secondCsv).toBe('"colX","colY"\r\n"valX","valY"\r\n');
      expect(Export.options.customLabels).toBeNull();
    });

    test('respects falsy options like labels: false and quote: ""', async () => {
      await Export.data('no-labels', [{ a: '1', b: '2' }], {
        labels: false,
        quote: '',
        CRLF: undefined,
        unknownOption: 'ignored',
      });

      const csvText = await readBlobText(capturedBlobs[0]);
      expect(csvText).toBe('1,2\r\n');
    });

    test('escapes embedded quotes and handles multi-char or empty separators', async () => {
      await Export.data(
        'quotes',
        [{ note: 'He said "hello"', val: 42 }],
        { separator: ' | ' }
      );
      const csvText = await readBlobText(capturedBlobs[0]);
      expect(csvText).toBe('"note" | "val"\r\n"He said ""hello""" | "42"\r\n');

      await Export.data('empty-sep', [{ only: 'one' }], {
        labels: false,
        separator: '',
      });
      const csvEmptySep = await readBlobText(capturedBlobs[1]);
      expect(csvEmptySep).toBe('"one"\r\n');
    });

    test('falls back to encodeURIComponent data URI when URL.createObjectURL is unavailable', async () => {
      URL.createObjectURL = undefined;
      await Export.data('utf8', [{ name: 'Galiléi' }], { labels: false });

      expect(clickedLinks).toHaveLength(1);
      expect(clickedLinks[0].href).toBe(
        `data:text/csv;charset=utf-8,${encodeURIComponent('"Galiléi"\r\n')}`
      );
    });
  });

  describe('setOptions', () => {
    test('updates static options including falsy values and ignores invalid inputs', () => {
      Export.setOptions(null);
      Export.setOptions('invalid');
      expect(Export.options.labels).toBe(true);

      Export.setOptions({
        labels: false,
        quote: '',
        separator: ';',
        unknownProp: 'ignored',
        CRLF: undefined,
      });

      expect(Export.options.labels).toBe(false);
      expect(Export.options.quote).toBe('');
      expect(Export.options.separator).toBe(';');
      expect(Export.options.CRLF).toBe('\r\n');
      expect(Export.options.unknownProp).toBeUndefined();
    });

    test('preserves persistent customLabels set via setOptions', async () => {
      Export.setOptions({ customLabels: { a: 'Header A' } });
      await Export.data('custom', [{ a: 'val' }]);
      const csvText = await readBlobText(capturedBlobs[0]);
      expect(csvText).toBe('"Header A"\r\n"val"\r\n');
    });
  });

  describe('save option (showSaveFilePicker)', () => {
    test('uses window.showSaveFilePicker when save: true and supported', async () => {
      const writtenChunks = [];
      const mockStream = {
        write: jest.fn(async blob => {
          writtenChunks.push(blob);
        }),
        close: jest.fn(async () => {}),
      };
      const mockHandle = {
        createWritable: jest.fn(async () => mockStream),
      };
      window.showSaveFilePicker = jest.fn(async () => mockHandle);

      const result = await Export.data('saved-file', [{ a: '1' }], { save: true });
      expect(result).toBe(true);
      expect(window.showSaveFilePicker).toHaveBeenCalledWith({
        suggestedName: 'saved-file.csv',
      });
      expect(mockHandle.createWritable).toHaveBeenCalledTimes(1);
      expect(mockStream.write).toHaveBeenCalledTimes(1);
      expect(mockStream.close).toHaveBeenCalledTimes(1);

      const savedText = await readBlobText(writtenChunks[0]);
      expect(savedText.replace(/\r\n/g, '\n')).toBe('"a"\n"1"\n');
    });

    test('returns false when user cancels showSaveFilePicker', async () => {
      window.showSaveFilePicker = jest.fn(async () => {
        throw new DOMException('The user aborted a request.', 'AbortError');
      });

      const result = await Export.data('aborted', [{ a: '1' }], { save: true });
      expect(result).toBe(false);
    });

    test('falls back to download when showSaveFilePicker is not supported', async () => {
      delete window.showSaveFilePicker;
      const result = await Export.data('fallback', [{ a: '1' }], { save: true });
      expect(result).toBe(true);
      expect(clickedLinks).toHaveLength(1);
      expect(clickedLinks[0].download).toBe('fallback.csv');
    });
  });
});
