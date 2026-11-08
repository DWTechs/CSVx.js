[![License: MIT](https://img.shields.io/npm/l/@dwtechs/csvx.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fcsvx.svg)](https://www.npmjs.com/package/@dwtechs/csvx)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/CSVx.js)](https://www.npmjs.com/package/@dwtechs/csvx)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)

## Synopsis

**[CSVx.js](https://github.com/DWTechs/CSVx.js)** is an open source CSV library written in TypeScript.

## Motivation

The main purpose of this library is to provide an easy way to export your data as CSV or transform your CSV data to something else.

## Installation

### npm

```bash
$ npm i @dwtechs/csvx
```

### yarn

```bash
$ yarn add @dwtechs/csvx
```

## Usage

### ES6

```html
<button id="csv">Export CSV</button>
<div id="table"></div>
```

```javascript
import { Export, Convert } from '@dwtechs/csvx';

// Convert an array to CSV file
const array = [
  {
    firstname: 'Galileo',
    lastname: 'Galiléi',
    born: 1564,
    died: 1642
  },
  {
    firstname: 'Nikola',
    lastname: 'Tesla',
    city: 'Smiljan',
    born: 1856,
    died: 1943
  },
  {
    firstname: 'Albert',
    born: 1879,
    lastname: 'Einstein',
    died: 1955
  }
];
const customLabels = {
  firstname: 'First name',
  lastname: 'Last name',
  city: 'City',
  born: 'Born',
  died: 'Died'
};
const exportButton = document.getElementById('csv');
exportButton.addEventListener('click', () => {
  Export.data('scientists', array, { separator: ';', customLabels }); // ; separator for excel friendly imports
});

// Convert CSV data to HTML table
const data = '"Firstname";"Lastname";"Born";"Died"\r\n\
"Galileo";"Galilei";"1564";"1642"\r\n\
"Nikola";"Tesla";"1856";"1943"\r\n\
"Albert";"Einstein";"1879";"1955"';

document.getElementById('table').innerHTML = Convert.table(data, { separator: ';' }, { table: 'table table-striped' });
```

### TypeScript

```html
<button (click)="exportCSV()">Export CSV</button> <!-- ANGULAR -->
```

```typescript
import { Export } from '@dwtechs/csvx';

public async exportCSV(): Promise<boolean> {

  const array: Record<string, string | number>[] = [
    {
      firstname: 'Galileo',
      lastname: 'Galiléi',
      born: 1564,
      died: 1642
    },
    {
      firstname: 'Nikola',
      lastname: 'Tesla',
      city: 'Smiljan',
      born: 1856,
      died: 1943
    },
    {
      firstname: 'Albert',
      born: 1879,
      lastname: 'Einstein',
      died: 1955
    }
  ];
  const customLabels = {
    firstname: 'First name',
    lastname: 'Last name',
    city: 'City',
    born: 'Born',
    died: 'Died'
  };

  return await Export.data('scientists', array, { separator: ';', customLabels });

}
```

## API Reference

```typescript

const Convert: {
  options: Partial<Options>;
  css: CSS;
  setOptions(options: Partial<Options>): void;
  setCSS(css: Partial<CSS>): void;
  // convert CSV to Javascript array
  array(data: string, options?: Partial<Options>): string[][] | false;
  // convert CSV to HTML table
  table(data: string, options?: Partial<Options>, css?: Partial<CSS>): string | false;
};

const Export: {
  options: Options;
  // Export CSV file
  data(filename: string, data: Record<string, number | string>[], options?: Partial<Options>): Promise<boolean>;
  setOptions(options: Partial<Options>): void;
};

interface Options {
  data?: string; // default : 'text/csv'
  charset?: string; // default : 'utf-8'
  labels?: boolean; // default : true
  quote?: string; // default : '"'
  separator?: string; // default : ','
  CRLF?: string; // default : '\r\n'
  customLabels?: Record<string, string> | null; // default : null
  save?: boolean; // default : false **
  bom?: boolean; // default : false (prepends UTF-8 BOM \uFEFF for Excel compatibility)
}

interface CSS {
  table?: string; // default : ''
  th?: string; // default : ''
}

```

** With the "save" option to true the user will be prompted to select where to save the file. 
Please note this option will only work on a https website or on Chrome browser.

## Contributors

CSVx.js is still in early development and I would be glad to get all the help you can provide for this project.
To contribute you can clone the project on **[GitHub](https://github.com/DWTechs/CSVx.js)** and see **contributor.md** for detailed installation walkthrough.

## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)       |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
