import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Image, File, Video, Folder } from '../models';

const FORBIDDEN_FILES = [
  '$RECYCLE.BIN',
  'Thumbs.db',
];

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private dialog = require('electron').remote.dialog;

  private ExifImage = require('exif').ExifImage;

  private fs = require('fs');

  /**
   * Prevent opening several folder select windows
   */
  private isChoosingFolder = false;

  onRootFolderChange = new Subject<string>();

  onCd = new Subject<string>();

  constructor(
    private zone: NgZone,
  ) { }

  private getImageDate(path: string, callback: (Date) => void) {
    try {
      new this.ExifImage(
        { image : path },
        (error, exifData) => {
          if (!error) {
            const stringDate = exifData.exif.DateTimeOriginal;
            const date = stringDate ? new Date(
              stringDate.slice(0, 4),
              stringDate.slice(5, 7) - 1,
              stringDate.slice(8, 10),
              stringDate.slice(11, 13),
              stringDate.slice(14, 16),
              stringDate.slice(17, 19),
            ) : undefined;

            this.zone.run(() => {
              callback(date);
            });
          }
        }
      );
    }
    catch (error) { }
  }

  selectRootFolder() {
    if (!this.isChoosingFolder) {
      this.isChoosingFolder = true;

      this.dialog.showOpenDialog(
        {
          title:"Select a folder",
          properties: [ "openDirectory" ],
        },
        (folderPaths: string[]) => {
          const folderPath = folderPaths && folderPaths.length ?
            folderPaths[0] : undefined
  
          this.zone.run(() => {
            this.isChoosingFolder = false;
  
            if (!folderPath) {
              alert('No folder has been chosen')
            }
            else {
              this.onRootFolderChange.next(folderPath);
              this.cd(folderPath);
            }
          });
        },
      );
    }
  }

  cd(folderPath: string) {
    if (folderPath.slice(-1) === '/') {
      folderPath = folderPath.substr(0, folderPath.length - 1)
    }

    this.onCd.next(folderPath);
  }

  ls(folderPath: string): {
    files: File[],
    folders: Folder[],
    images: Image[],
    videos: Video[],
  } {
    // Remove hidden and forbidden files
    const filteredFiles = this.fs.readdirSync(folderPath).filter((file: string) => {
      return file[0] !== '.' && FORBIDDEN_FILES.indexOf(file) === -1;
    });

    let files = [];
    let folders = [];
    let images = [];
    let videos = [];

    filteredFiles.forEach(file => {
      if (Image.isImage(file)) {
        const image = new Image(folderPath, file);
        this.getImageDate(
          image.path,
          (date: Date) => {
            image.date = date;
          }
        );
        images.push(image);
      }
      else if (Folder.isFolder(folderPath, file)) {
        folders.push(new Folder(folderPath, file));
      }
      else if (Video.isVideo(file)) {
        videos.push(new Video(folderPath, file));
      }
      else {
        files.push(new File(folderPath, file));
      }
    });

    return { folders, files, videos, images };
  }

  lsNested(folderPath: string): {
    files: File[],
    folders: Folder[],
    images: Image[],
    videos: Video[],
  } {
    const files = this.ls(folderPath);

    for (let index = 0; index < files.folders.length; index++) {
      const folder = files.folders[index];
      const nestedFiles = this.lsNested(folder.path);

      files.files = files.files.concat(nestedFiles.files);
      files.folders = files.folders.concat(nestedFiles.folders);
      files.images = files.images.concat(nestedFiles.images);
      files.videos = files.videos.concat(nestedFiles.videos);
    }

    return files;
  }

}
