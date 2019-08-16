import { Injectable, NgZone } from '@angular/core';
import { Folder, Image, Video, ImageFactory } from '../models';
import * as fs from 'fs';
import { Subject } from 'rxjs';
import { THUMBNAIL_FOLDER } from './thumbnail.service';

export const FORBIDDEN_FILES = [
  '$RECYCLE.BIN',
  'Thumbs.db',
  THUMBNAIL_FOLDER,
];

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private cache = {};

  onFileList = new Subject<Folder>();

  constructor(
    private imageFactory: ImageFactory,
    private zone: NgZone,
  ) { }

  ls(folder: Folder) {
    // Checking cache
    const folderCache = this.cache[folder.path];
    if (folderCache) {
      this.onFileList.next(folderCache);
      return;
    }

    fs.readdir(folder.path, (error, fileNames) => {
      this.zone.run(() => {
        if (error) return;

        // Remove hidden and forbidden files
        const filteredFileNames = fileNames.filter((fileName) => {
          return fileName[0] !== '.' && FORBIDDEN_FILES.indexOf(fileName) === -1;
        });

        filteredFileNames.forEach(async fileName => {
          const filePath = folder.path + '/' + fileName;

          if (await Folder.isFolder(filePath)) {
            folder.addFolder(new Folder(filePath));
          }
          else if (Image.isImage(filePath)) {
            folder.addImage(this.imageFactory.createImage(filePath));
          }
          else if (Video.isVideo(filePath)) {
            folder.addVideo(new Video(filePath));
          }
        });

        this.cache[folder.path] = folder;
        this.onFileList.next(folder);
      });
    });
  }

}
