import * as path from 'path';

export class File {

  name: string;

  parent: string;

  path: string;

  type = 'file';

  constructor(path: string) {
    const split = path.split('/');

    this.name = split.slice(-1)[0];
    this.parent = split.slice(0, -1).join('/');
    this.path = path;
  }

  protected static checkExtension(filePath: string, allowedExtentions: string[]): boolean {
    return allowedExtentions.indexOf(path.extname(filePath).slice(1).toLowerCase()) !== -1;
  }

}
