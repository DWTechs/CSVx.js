import { Convert } from '../dist/csvx.js';

const csvData =
  '"Firstname";"Lastname";"Born";"Died"\r\n' +
  '"Galileo";"Galilei";"1564";"1642"\r\n' +
  '"Nikola";"Tesla";"1856";"1943"\r\n' +
  '"Albert";"Einstein";"1879";"1955"';

describe('Convert', () => {
  beforeEach(() => {
    Convert.options = {
      labels: true,
      quote: '"',
      separator: ',',
      CRLF: '\r\n',
    };
    Convert.css = {
      table: '',
      th: '',
    };
  });

  describe('Convert.array', () => {
    test('returns false for non-string or empty/whitespace-only input', () => {
      expect(Convert.array(null)).toBe(false);
      expect(Convert.array(undefined)).toBe(false);
      expect(Convert.array(123)).toBe(false);
      expect(Convert.array({})).toBe(false);
      expect(Convert.array('')).toBe(false);
      expect(Convert.array('   \r\n  ')).toBe(false);
    });

    test('converts CSV string into a 2D array with custom separator', () => {
      const result = Convert.array(csvData, { separator: ';' });
      expect(result).toEqual([
        ['Firstname', 'Lastname', 'Born', 'Died'],
        ['Galileo', 'Galilei', '1564', '1642'],
        ['Nikola', 'Tesla', '1856', '1943'],
        ['Albert', 'Einstein', '1879', '1955'],
      ]);
    });

    test('unescapes doubled quotes and preserves unquoted cells', () => {
      const input = '"He said ""hi""",unquoted,"plain"\r\n';
      const result = Convert.array(input);
      expect(result).toEqual([['He said "hi"', 'unquoted', 'plain']]);
    });

    test('handles quote: "" option without stripping characters and strips leading UTF-8 BOM', () => {
      const input = '\uFEFFa,b,c\r\n1,2,3';
      const result = Convert.array(input, {
        quote: '',
        CRLF: undefined,
        unknownOption: 'ignored',
      });
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['1', '2', '3'],
      ]);
    });
  });

  describe('Convert.table', () => {
    test('returns false for invalid CSV data', () => {
      expect(Convert.table('')).toBe(false);
      expect(Convert.table(null)).toBe(false);
    });

    test('converts CSV to HTML table with thead and tbody by default', () => {
      const html = Convert.table(csvData, { separator: ';' });
      expect(html).toBe(
        '<table>' +
          '<thead><tr><th>Firstname</th><th>Lastname</th><th>Born</th><th>Died</th></tr></thead>' +
          '<tbody>' +
          '<tr><td>Galileo</td><td>Galilei</td><td>1564</td><td>1642</td></tr>' +
          '<tr><td>Nikola</td><td>Tesla</td><td>1856</td><td>1943</td></tr>' +
          '<tr><td>Albert</td><td>Einstein</td><td>1879</td><td>1955</td></tr>' +
          '</tbody>' +
          '</table>'
      );
    });

    test('converts CSV to HTML table without thead when labels: false', () => {
      const input = '"Galileo","Galilei"\r\n"Nikola","Tesla"';
      const html = Convert.table(input, { labels: false });
      expect(html).toBe(
        '<table>' +
          '<tbody>' +
          '<tr><td>Galileo</td><td>Galilei</td></tr>' +
          '<tr><td>Nikola</td><td>Tesla</td></tr>' +
          '</tbody>' +
          '</table>'
      );
    });

    test('applies CSS classes to table and th elements without polluting defaults', () => {
      const input = '"Col1","Col2"\r\n"Val1","Val2"';
      const html = Convert.table(
        input,
        {},
        { table: 'table table-striped', th: 'header-cell' }
      );
      expect(html).toBe(
        '<table class="table table-striped">' +
          '<thead><tr><th class="header-cell">Col1</th><th class="header-cell">Col2</th></tr></thead>' +
          '<tbody><tr><td>Val1</td><td>Val2</td></tr></tbody>' +
          '</table>'
      );

      // Subsequent call should not retain previous per-call CSS classes
      const nextHtml = Convert.table(input);
      expect(nextHtml).toBe(
        '<table>' +
          '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>' +
          '<tbody><tr><td>Val1</td><td>Val2</td></tr></tbody>' +
          '</table>'
      );
    });

    test('escapes HTML special characters in cells to prevent XSS', () => {
      const input = '"<script>alert(1)</script>","A & B"\r\n"\'quote\'","<b>bold</b>"';
      const html = Convert.table(input);
      expect(html).toBe(
        '<table>' +
          '<thead><tr><th>&lt;script&gt;alert(1)&lt;/script&gt;</th><th>A &amp; B</th></tr></thead>' +
          '<tbody><tr><td>&#39;quote&#39;</td><td>&lt;b&gt;bold&lt;/b&gt;</td></tr></tbody>' +
          '</table>'
      );
    });
  });

  describe('setOptions and setCSS', () => {
    test('updates static options and css, including falsy values, and ignores invalid inputs', () => {
      Convert.setOptions(null);
      Convert.setCSS(null);

      Convert.setOptions({ labels: false, quote: '', separator: '|', unknown: 'x' });
      Convert.setCSS({ table: 'my-table', th: 'my-th', extra: 'y' });

      expect(Convert.options.labels).toBe(false);
      expect(Convert.options.quote).toBe('');
      expect(Convert.options.separator).toBe('|');
      expect(Convert.options.unknown).toBeUndefined();

      expect(Convert.css.table).toBe('my-table');
      expect(Convert.css.th).toBe('my-th');
      expect(Convert.css.extra).toBeUndefined();
    });
  });
});
