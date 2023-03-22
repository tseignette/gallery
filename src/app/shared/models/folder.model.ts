import { File } from "./file.model";

export class Folder extends File {

  private static fs = require('fs');

  constructor(
    folder,
    name,
  ) {
    super(folder, name);
  }

  static isFolder(folder: string, name: string): boolean {
    return this.fs.lstatSync(folder + '/' + name).isDirectory();
  }

}
