import { Injectable, NgZone } from '@angular/core';
import { ExifImage } from 'exif';
import { Subject } from 'rxjs';
import { Image, File, Video, Folder } from '../models';
import { SettingsService } from './settings.service';
import { ThumbnailService, THUMBNAIL_FOLDER } from './thumbnail.service';
import * as fs from 'fs';

const FORBIDDEN_FILES = [
  '$RECYCLE.BIN',
  'Thumbs.db',
  THUMBNAIL_FOLDER,
];

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private dialog = require('electron').remote.dialog;

  /**
   * Prevent opening several folder select windows
   */
  private isChoosingFolder = false;

  onRootFolderChange = new Subject<string>();

  onCd = new Subject<string>();

  constructor(
    private settingsService: SettingsService,
    private thumbnailService: ThumbnailService,
    private zone: NgZone,
  ) { }

  private setRootFolder(rootFolder: string) {
    this.thumbnailService.setThumbnailFolder(rootFolder);
    this.onRootFolderChange.next(rootFolder);
    this.cd(rootFolder);
  }

  private setImageDate(image: Image) {
    try {
      new ExifImage(
        { image : image.path },
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
              image.date = date;
            });
          }
          else {
            console.log(error);
          }
        }
      );
    }
    catch (error) {
      console.log(error);
    }
  }

  checkSettings() {
    setTimeout(() => {
      const rootFolderSettings = this.settingsService.get('rootFolder');
      if (rootFolderSettings) {
        this.setRootFolder(rootFolderSettings);
      }
    });
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
              this.settingsService.set('rootFolder', folderPath);
              this.setRootFolder(folderPath);
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
    const filteredFiles = fs.readdirSync(folderPath).filter((file: string) => {
      return file[0] !== '.' && FORBIDDEN_FILES.indexOf(file) === -1;
    });

    let files = [];
    let folders = [];
    let images = [];
    let videos = [];

    filteredFiles.forEach(file => {
      if (Image.isImage(file)) {
        const image = new Image(folderPath, file);
        this.thumbnailService.setImageThumbnail(image);
        this.setImageDate(image);
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
