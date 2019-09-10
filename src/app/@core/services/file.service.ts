import { Injectable, NgZone } from '@angular/core';
import { Folder, Image, Video } from '../models';
import * as fs from 'fs';
import { Subject } from 'rxjs';
import { THUMBNAIL_FOLDER, ThumbnailService } from './thumbnail.service';

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
    private thumbnailService: ThumbnailService,
    private zone: NgZone,
  ) { }

  private generateThumbnails(folder: Folder) {
    folder.medias.forEach((media: Image) => {
      if (Image.isImage(media.path)) {
        this.thumbnailService.setImageThumbnail(media);
      }
    });
  }

  private __ls(folder: Folder, generateThumbnailsAndPreviews = true) {
    return new Promise<Folder>((resolve, reject) => {
      // Checking cache
      const folderCache = this.cache[folder.path];
      if (folderCache) {
        resolve(folderCache.folder);

        // Thumbnails aren't generated for inner folders
        if (!folderCache.thumbnailsGenerated) {
          folderCache.thumbnailsGenerated = true;
          this.generateThumbnails(folderCache.folder);
        }

        return;
      }

      fs.readdir(folder.path, (error, fileNames) => {
        this.zone.run(() => {
          if (error) reject(error);

          // Remove hidden and forbidden files
          const filteredFileNames = fileNames.filter((fileName) => {
            return fileName[0] !== '.' && FORBIDDEN_FILES.indexOf(fileName) === -1;
          });

          filteredFileNames.forEach(async fileName => {
            const filePath = folder.path + '/' + fileName;

            if (await Folder.isFolder(filePath)) {
              const innerFolder = new Folder(filePath);

              // Calling ls will generate the preview
              if (generateThumbnailsAndPreviews) this.__ls(innerFolder, false);

              folder.addFolder(innerFolder);
            }
            else if (Image.isImage(filePath)) {
              const image = new Image(filePath);

              // If we want to generate thumbnails or if it's the first image (= folder has no
              // image preview yet)
              if (generateThumbnailsAndPreviews || !folder.nbImages) {
                this.thumbnailService.setImageThumbnail(image).then(() => {
                  folder.imagePreview = image.thumbnail
                });
              }

              folder.addImage(image);
            }
            else if (Video.isVideo(filePath)) {
              const video = new Video(filePath);

              // If it's the first video (= folder has no video preview yet)
              if (!folder.nbVideos) {
                folder.videoPreview = video.path;
              }

              folder.addVideo(video);
            }
          });

          this.cache[folder.path] = {
            folder,
            thumbnailsGenerated: generateThumbnailsAndPreviews,
          };
          resolve(folder);
        });
      });
    });
  }

  async ls(folder: Folder) {
    this.onFileList.next(await this.__ls(folder));
  }

}
