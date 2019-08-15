import { File } from "./file.model";

export const ALLOWED_IMAGES = [
  'png',
  'jpg',
  'jpeg',
  'gif',
];

export class Image extends File {

  constructor(path: string) {
    super(path);
  }

  static isImage(filePath: string) {
    return File.checkExtension(filePath, ALLOWED_IMAGES);
  }

}
