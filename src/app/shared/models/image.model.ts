import { File } from "./file.model";

const ALLOWED_IMAGES = [
  'png',
  'jpg',
  'jpeg',
  'gif',
];

export class Image extends File {

  date: Date;

  thumbnail: string;

  constructor(
    folder,
    name,
  ) {
    super(folder, name);
  }

  static isImage(name: string): boolean {
    return File.checkExtension(name, ALLOWED_IMAGES);
  }

}
