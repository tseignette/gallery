import { File } from "./file.model";

export const ALLOWED_VIDEOS = [
  'mp4',
];

export class Video extends File {

  constructor(path: string,) {
    super(path, 'video');
  }

  static isVideo(filePath: string) {
    return File.checkExtension(filePath, ALLOWED_VIDEOS);
  }

}
