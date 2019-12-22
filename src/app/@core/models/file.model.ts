import * as path from 'path';

export class File {

  date: Date;

  name: string;

  parent: string;

  path: string;

  type: string;

  constructor(path: string, type = 'file') {
    const split = path.split('/');

    this.name = split.slice(-1)[0];
    this.parent = split.slice(0, -1).join('/');
    this.path = path;

    this.type = type;

    this.date = new Date(); // TODO: set real date
  }

  protected static checkExtension(filePath: string, allowedExtentions: string[]): boolean {
    return allowedExtentions.indexOf(path.extname(filePath).slice(1).toLowerCase()) !== -1;
  }

}
