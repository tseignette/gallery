var path = require('path');

export class File {

  path: string;

  constructor(
    public folder,
    public name,
  ) {
    this.path = folder + '/' + name;
  }

  protected static checkExtension(name: string, allowedExtentions: string[]): boolean {
    return allowedExtentions.indexOf(path.extname(name).slice(1).toLowerCase()) !== -1;
  }

}
