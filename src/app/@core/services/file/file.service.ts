import { Injectable, NgZone } from '@angular/core';
import { Folder } from '../../models';
import * as fs from 'fs';
import { Subject } from 'rxjs';
import { THUMBNAIL_FOLDER, ThumbnailService } from '../thumbnail.service';
import { ViewTypeService } from '../view-type/view-type.service';
import { LsStrategy } from './ls-strategy.model';

export const FORBIDDEN_FILES = [
  '$RECYCLE.BIN',
  'Thumbs.db',
  THUMBNAIL_FOLDER,
];

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private lsCache = {};

  private strategyCache = {};

  private lsStrategy: LsStrategy;

  private viewTypeId: string;

  onFileList = new Subject<Folder>();

  constructor(
    private thumbnailService: ThumbnailService,
    private viewTypeService: ViewTypeService,
    private zone: NgZone,
  ) {
    this.viewTypeService.onViewTypeUpdate.subscribe(viewType => {
      this.viewTypeId = viewType.id;
      this.lsStrategy = viewType.strategy;
    });

    this.viewTypeService.getViewType();
  }

  private __ls(folderPath: string) {
    return new Promise<Folder>((resolve, reject) => {
      // Checking cache
      const cachedFolder = this.lsCache[folderPath];
      if (cachedFolder) {
        resolve(cachedFolder);
        return;
      }

      // Otherwise list files
      fs.readdir(folderPath, (error, fileNames) => {
        this.zone.run(async () => {
          if (error) reject(error);

          // Remove hidden and forbidden files
          const filteredFileNames = fileNames.filter((fileName) => {
            return fileName[0] !== '.' && FORBIDDEN_FILES.indexOf(fileName) === -1;
          });

          const folder = new Folder(folderPath);
          for (const fileName of filteredFileNames) {
            const filePath = folderPath + '/' + fileName;
            await folder.addFile(filePath);
          };

          this.lsCache[folderPath] = folder;
          resolve(folder);
        });
      });
    });
  }

  private buildList(folderPath: string, depth = 0) {
    return new Promise<Folder>(async (resolve, reject) => {
      const fileList = await this.__ls(folderPath);
      
      if (await this.lsStrategy.continue(fileList, depth)) {
        for (let innerFolder of fileList.folders) {
          await this.buildList(innerFolder.path, ++depth);
        }
      }
      else {
        for (const i in fileList.folders) {
          fileList.folders[i] = await this.__ls(fileList.folders[i].path);
        }
      }

      resolve();
    });
  }

  async ls(folderPath: string) {
    let fileList;

    if (this.strategyCache[this.viewTypeId] && this.strategyCache[this.viewTypeId][folderPath]) {
      fileList = this.strategyCache[this.viewTypeId][folderPath];
    }
    else {
      this.lsStrategy.init(folderPath);
      await this.buildList(folderPath);
      fileList = this.lsStrategy.getResult();

      // Setting cache
      if (!this.strategyCache[this.viewTypeId]) this.strategyCache[this.viewTypeId] = {};
      this.strategyCache[this.viewTypeId][folderPath] = fileList;
    }

    this.thumbnailService.setThumbnails(fileList);
    this.onFileList.next(fileList);
  }

}
