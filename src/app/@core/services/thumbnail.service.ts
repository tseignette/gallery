import { Injectable, NgZone } from '@angular/core';
import { Image, Folder } from '../models';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { ProgressService } from './progress.service';

export const THUMBNAIL_FOLDER = 'thumbnails';
export const THUMBNAIL_HEIGHT = 200;

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  private nbThumbnailsDone = 0;

  private queue: { image: Image, thumbnailPath: string, callback: Function }[] = [];

  private thumbnailFolderPath: string;

  private working = false;

  constructor(
    private progressService: ProgressService,
    private zone: NgZone,
  ) { }

  private addToQueue(image: Image, thumbnailPath: string, callback: Function) {
    this.queue.push({ image, thumbnailPath, callback });
    this.checkQueue();
  }

  private checkQueue() {
    this.progressService.setProgressBar(this.nbThumbnailsDone, this.queue.length);

    if (this.working || !this.queue.length) {
      this.nbThumbnailsDone = 0;
      return;
    }

    this.working = true;
    const task = this.queue.shift();
    this.createImageThumbnail(task.image, task.thumbnailPath, task.callback);
  }

  private createImageThumbnail(image: Image, thumbnailPath: string, callback: Function) {
    const thumbnailFolderPath = path.dirname(thumbnailPath);
    const endCallback = () => {
      this.nbThumbnailsDone++;
      this.working = false;
      this.checkQueue();
    }

    jimp
      .read('file://' + image.path)
      .then((picture) => {
        return picture
          .resize(jimp.AUTO, THUMBNAIL_HEIGHT)
          .getBufferAsync(jimp.MIME_JPEG)
          .then((buffer) => {
            mkdirp(thumbnailFolderPath, (error) => {
              if (error) throw error;

              fs.writeFile(thumbnailPath, buffer, (error) => {
                if (error) throw error;

                callback();
                endCallback();
              });
            });
          });
        }
      )
      .catch(endCallback);
  }

  setGallery(gallery: Folder) {
    this.thumbnailFolderPath = gallery.path + '/' + THUMBNAIL_FOLDER;
  }

  setImageThumbnail(image: Image) {
    const imageThumbnailPath = this.thumbnailFolderPath + image.path;
    const setThumbnail = () => {
      this.zone.run(() => {
        image.thumbnail = imageThumbnailPath;
      });
    }

    // Checking if thumbnail exists
    fs.access(imageThumbnailPath, fs.constants.F_OK, (error) => {
      if (!error) setThumbnail();
      else this.addToQueue(image, imageThumbnailPath, setThumbnail);
    });
  }

}
