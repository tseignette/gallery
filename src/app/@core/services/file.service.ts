import { Injectable, NgZone } from '@angular/core';
import { Folder, Image, Video } from '../models';
import * as fs from 'fs';
import { Subject } from 'rxjs';

export const FORBIDDEN_FILES = [
  '$RECYCLE.BIN',
  'Thumbs.db',
];

@Injectable({
  providedIn: 'root'
})
export class FileService {

  onFileList = new Subject<Folder>();

  constructor(
    private zone: NgZone,
  ) { }

  ls(folder: Folder) {
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
            folder.addImage(new Image(filePath));
          }
          else if (Video.isVideo(filePath)) {
            folder.addVideo(new Video(filePath));
          }
        });

        this.onFileList.next(folder);
      });
    });
  }

}
