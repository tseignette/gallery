import { File } from "./file.model";

const ALLOWED_VIDEOS = [
  'mp4',
];

export class Video extends File {

  constructor(
    folder,
    name,
  ) {
    super(folder, name);
  }

  static isVideo(name: string): boolean {
    return File.checkExtension(name, ALLOWED_VIDEOS);
  }

}
