import { File } from "./file.model";

export const ALLOWED_IMAGES = [
  'png',
  'jpg',
  'jpeg',
  'gif',
];

export class Image extends File {

  thumbnail: string;

  constructor(path: string) {
    super(path);

    this.type = 'image';
  }

  static isImage(filePath: string) {
    return File.checkExtension(filePath, ALLOWED_IMAGES);
  }

}
