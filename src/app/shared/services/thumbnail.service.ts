import { Injectable, NgZone } from '@angular/core';
import { Image } from '../models';
import { remote } from 'electron';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

export const THUMBNAIL_FOLDER = 'thumbnail';
export const THUMBNAIL_HEIGHT = 200;

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  private browserWindow = remote.getCurrentWindow();

  private doneThumbnails = 0;

  private thumbnailFolder: string;

  private totalThumbnails = 0;

  constructor(
    private zone: NgZone,
  ) { }

  private updateProgressBar() {
    const progress = this.doneThumbnails / this.totalThumbnails;

    if (progress === 1) {
      this.doneThumbnails = this.totalThumbnails = 0;
    }

    this.browserWindow.setProgressBar(progress === 1 ? -1 : progress);
  }

  private incrementDoneThumbnails() {
    this.doneThumbnails++;
    this.updateProgressBar();
  }

  private incrementTotalThumbnails() {
    this.totalThumbnails++;
    this.updateProgressBar();
  }

  private createThumb(image: Image, thumbnailPath: string, callback: Function) {
    this.incrementTotalThumbnails();
    const thumbnailFolder = path.dirname(thumbnailPath);

    jimp
      .read('file://' + image.path)
      .then((picture) => {
        return picture
          .resize(jimp.AUTO, THUMBNAIL_HEIGHT)
          .getBufferAsync(jimp.MIME_JPEG)
          .then((buffer) => {
            mkdirp(thumbnailFolder, (error) => {
              if (error) {
                this.incrementDoneThumbnails();
                return;
              }

              fs.writeFile(thumbnailPath, buffer, (error) => {
                this.incrementDoneThumbnails();

                if (!error) {
                  callback();
                }
              });
            });
          });
        }
      )
      .catch(err => {
        this.incrementDoneThumbnails();
      });
  }

  setThumbnailFolder(rootFolder: string) {
    this.thumbnailFolder = rootFolder + '/' + THUMBNAIL_FOLDER;
  }

  setImageThumbnail(image: Image) {
    const thumbnailPath = this.thumbnailFolder + image.path;
    const setThumbnail = () => {
      this.zone.run(() => {
        image.thumbnail = thumbnailPath;
      });
    }

    // Checking if thumbnail exists
    fs.access(thumbnailPath, fs.constants.F_OK, (err) => {
      if (!err) {
        setThumbnail();
      }
      else {
        this.createThumb(image, thumbnailPath, setThumbnail);
      }
    });
  }

}
