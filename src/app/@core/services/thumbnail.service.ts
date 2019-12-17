import { Injectable, NgZone } from '@angular/core';
import { Image, Folder } from '../models';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { ProgressService } from './progress.service';

export const THUMBNAIL_FOLDER = 'thumbnails';
export const THUMBNAIL_HEIGHT = 300;

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  private currentTask: { image: Image, thumbnailPath: string, callback: Function };

  private galleryPath: string;

  private nbThumbnailsDone = 0;

  private queue: { image: Image, thumbnailPath: string, callback: Function }[] = [];

  private thumbnailFolderPath: string;

  private working = false;

  constructor(
    private progressService: ProgressService,
    private zone: NgZone,
  ) { }

  private refreshProgress() {
    this.zone.run(() => {
      const done = this.nbThumbnailsDone;
      const todo = this.queue.length + (this.currentTask ? 1 : 0);
      const total = done + todo;
      const title = 'Generating preview (' + (done + 1) + '/' + total + '): '

      this.progressService.setProgressBar(
        done,
        todo,
        !this.currentTask ? '' : title + this.currentTask.image.name
      );
    });
  }

  private addToQueue(image: Image, thumbnailPath: string, callback: Function) {
    this.queue.push({ image, thumbnailPath, callback });
    this.checkQueue();
  }

  private checkQueue() {
    // If it's already working, don't do anything
    if (this.working) {
      this.refreshProgress();
      return;
    }

    // If the queue is empty, reset variables and return
    if (!this.queue.length) {
      this.currentTask = undefined;
      this.refreshProgress();
      this.nbThumbnailsDone = 0;
      return;
    }

    // Otherwise, start a new task
    const task = this.queue.shift();
    this.working = true;
    this.currentTask = task;
    this.refreshProgress();
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
    this.galleryPath = gallery.path;
    this.thumbnailFolderPath = gallery.path + '/' + THUMBNAIL_FOLDER;
  }

  setImageThumbnail(image: Image) {
    return new Promise<void>((resolve, reject) => {
      const imageRelativePath = image.path.substr(this.galleryPath.length);
      const imageThumbnailPath = this.thumbnailFolderPath + imageRelativePath;

      const setThumbnail = () => {
        this.zone.run(() => {
          image.thumbnail = imageThumbnailPath;
          resolve();
        });
      }

      // Checking if thumbnail exists
      fs.access(imageThumbnailPath, fs.constants.F_OK, (error) => {
        if (!error) setThumbnail();
        else this.addToQueue(image, imageThumbnailPath, setThumbnail);
      });
    });
  }

}
