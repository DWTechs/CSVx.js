import { Options } from './interfaces';
import { isObject } from '@dwtechs/checkhard';

export class Export {

  // static log = Logger.addGroup('CSVx Exporter');
  // default option values
  static options: Options = {
    data: 'text/csv',
    charset: 'utf-8',
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
    customLabels: null,
    save: false,
  }

  public static async data( filename: string,
                      data: { [key: string]: number|string }[],
                      options?: Partial<Options>
                    ): Promise<boolean> {
    
    // check data consistency
    for (let row of data) {                    
      if (!isObject(row)) {
        return false;
      }
    }

    if (!filename) {
      filename = 'export';
    }
    if (options) {
      this.setOptions(options);
    }
    let table: string = '';
    let labels: string[] = [];
    if (!this.options.customLabels) {
      labels = this.createLabels(data);
    } else {
      labels = this.createCustomLabels(this.options.customLabels);
    }
    if(this.options.labels) {
      table += this.createLabelsRow(labels);
    }
    table += this.createTable(data);
    // console.log('table', table);
    if(this.options.save){
      await this.save(table, filename);
    } else {
      this.download(table, filename);
    }
    return true;
  }

  public static setOptions(options: Partial<Options>): void {
    for(const property in options) {
      if (options.hasOwnProperty(property) && this.options.hasOwnProperty(property)) {
        this.options[property] = options[property]||this.options[property];
      }
    }
  }

  private static download(table:string, filename: string): void {
    let encodedTable = `data:${this.options.data};charset=${this.options.charset},${escape(table)}`;
    if((window as any).navigator.msSaveOrOpenBlob) {
      // IE11
      (window as any).navigator.msSaveOrOpenBlob(encodedTable, filename);
    } else {
      let link = document.createElement('a');
      link.setAttribute('href', encodedTable);
      link.setAttribute('download', filename+'.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private static async save(table: string, filename: string ): Promise<void> {
    let encodedTable = table;
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName: filename+'.csv'
    });
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(new Blob([encodedTable], { type: `${this.options.data};charset=${this.options.charset}`, endings:'native' }));
    await fileStream.close();
  };

  private static createTable( data: { [key: string]: number|string }[] ): string {
    let table: string = '';
    for (let row of data) {
      let parsedRow: string = '';
      for (let property in this.options.customLabels) {
        if (this.options.customLabels.hasOwnProperty(property)) {
          parsedRow += this.createField((row[property] as string|number) ?? '');
        }
      }
      table += this.createRow(parsedRow);
    }
    return table;
  }

  private static createLabels (data: { [key: string]: number|string }[]): string[] {
    let params: string[] = [];
    for (let row of data) {
      let i = 0;
      for (let property in row) {
        if (row.hasOwnProperty(property)) {
          const newProperty = params.find(value => value === property);
          if (!newProperty) {
            params.splice(i, 0, property);
          }
          i++;
        }
      }
    }
    this.options.customLabels = {};
    for (let param of params) {
      this.options.customLabels[param] = param;
    }
    return params;
  }

  private static createCustomLabels (customLabels: { [key: string]: string }): string[] {
    let params: string[] = [];
    for (let property in customLabels) {
      if (customLabels.hasOwnProperty(property)) {
        params.push(customLabels[property]);
      }
    }
    return params;
  }

  private static createLabelsRow(labels: string[]): string {
    let parsedRow: string = '';
    for(let label of labels) {
      parsedRow += this.createField(label);
    }
    return this.createRow(parsedRow);
  }

  private static createRow(row: string): string {
    // console.log(row.slice(0, -1) + this.options.CRLF);
    // console.log('row', row);
    return row.slice(0, -1) + this.options.CRLF;
  }

  private static createField(content:string|number): string {
    // console.log('field', content);
    return this.options.quote + content + this.options.quote + this.options.separator;
  }

}
