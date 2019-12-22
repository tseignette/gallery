import { File } from "./file.model";
import * as fs from 'fs';
import { Image } from "./image.model";
import { Video } from "./video.model";

export class Folder extends File {

  folders: Folder[] = [];

  images: Image[] = [];

  videos: Video[] = [];

  medias: (Image|Video)[] = [];

  nbFolders = 0;

  nbImages = 0;

  nbMedias = 0;

  nbVideos = 0;

  areThumbnailsSet = false;

  imagePreview: string;

  videoPreview: string;

  prettyName = this.name;

  isEvent = false;

  start: Date;

  end: Date;

  constructor(path: string) {
    super(path, 'folder');

    this.initEvent();
  }

  /**
   * TODO: doc
   */
  private initEvent() {
    if (this.name[0] !== '[') return;

    let start: Date;
    let end: Date;
    let prettyNamePadding;

    if (this.name[11] === ']') {
      prettyNamePadding = 13;
      start = new Date(this.name.slice(1, 11).replace(/:/g, '/'));
      end = start;
    }
    else if (this.name[22] === ']') {
      prettyNamePadding = 24;
      start = new Date(this.name.slice(1, 11).replace(/:/g, '/'));
      end = new Date(this.name.slice(12, 22).replace(/:/g, '/'));
    }
    else return;

    // If one of the date is invalid, don't consider it as an event folder
    if (isNaN(start.valueOf()) || isNaN(end.valueOf())) return;

    this.isEvent = true;
    this.start = start;
    this.end = end;
    this.prettyName = this.name.slice(prettyNamePadding);
  }

  static isFolder(filePath: string) {
    return new Promise<boolean>((resolve, reject) => {
      fs.lstat(filePath, (error, stats) => {
        if (error) reject (error);

        resolve(stats.isDirectory());
      });
    });
  }

  async addFile(filePath: string) {
    if (await Folder.isFolder(filePath)) {
      this.addFolder(new Folder(filePath));
    }
    else if (Image.isImage(filePath)) {
      this.addImage(new Image(filePath));
    }
    else if (Video.isVideo(filePath)) {
      this.addVideo(new Video(filePath));
    }
  }

  addFolder(folder: Folder) {
    this.nbFolders++;
    this.folders.push(folder);
  }

  addImage(image: Image) {
    this.nbImages++;
    this.nbMedias++;
    this.images.push(image);
    this.medias.push(image);
  }

  addVideo(video: Video) {
    this.nbVideos++;
    this.nbMedias++;
    this.videos.push(video);
    this.medias.push(video);
  }

}
