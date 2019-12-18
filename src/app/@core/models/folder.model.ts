import { File } from "./file.model";
import * as fs from 'fs';
import { Image } from "./image.model";
import { Video } from "./video.model";

export class Folder extends File {

  folders: Folder[] = [];

  medias: (Image|Video)[] = [];

  nbFolders = 0;

  nbImages = 0;

  nbMedias = 0;

  nbVideos = 0;

  areThumbnailsSet = false;

  imagePreview: string;

  videoPreview: string;

  constructor(path: string) {
    super(path);

    this.type = 'folder';
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
    this.medias.push(image);
  }

  addVideo(video: Video) {
    this.nbVideos++;
    this.nbMedias++;
    this.medias.push(video);
  }

}
