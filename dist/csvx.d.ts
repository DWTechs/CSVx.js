/** MIT License
* 
* Copyright (c) 2018 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* https://github.com/DWTechs/CSVx.js
*/

export declare type CellTypes = 'td' | 'th';
export declare class Convert {
    static options: Partial<Options>;
    static css: CSS;
    static setOptions(options: Partial<Options>): void;
    static setCSS(css: Partial<CSS>): void;
    static array(data: string, options?: Partial<Options>, css?: Partial<CSS>): Array<Array<string>> | false;
    static table(data: string, options?: Partial<Options>, css?: Partial<CSS>): string | false;
    private static createTr;
    private static setObject;
}



export declare class Export {
    static options: Options;
    static data(filename: string, data: {
        [key: string]: number | string;
    }[], options?: Partial<Options>): Promise<boolean>;
    static setOptions(options: Partial<Options>): void;
    private static download;
    private static save;
    private static createTable;
    private static createLabels;
    private static createCustomLabels;
    private static createLabelsRow;
    private static createRow;
    private static createField;
}
export interface Options {
    data: string;
    charset: string;
    labels: boolean;
    quote: string;
    separator: string;
    CRLF: string;
    customLabels: {
        [key: string]: string;
    } | null;
    save: boolean;
    [key: string]: string[] | String | boolean | {
        [key: string]: string;
    } | null;
}
export interface CSS {
    table: string;
    th: string;
    [key: string]: String;
}
