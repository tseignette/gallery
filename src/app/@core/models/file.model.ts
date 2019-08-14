export class File {

  name: string;

  parent: string;

  path: string;

  constructor(path: string) {
    const split = path.split('/');

    this.name = split.slice(-1)[0];
    this.parent = split.slice(0, -1).join('/');
    this.path = path;
  }

}
