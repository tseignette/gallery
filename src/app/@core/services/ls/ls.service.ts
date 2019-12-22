import { Injectable, NgZone } from '@angular/core';
import { Folder } from '../../models';
import * as fs from 'fs';
import { Subject } from 'rxjs';
import { THUMBNAIL_FOLDER, ThumbnailService } from '../thumbnail.service';
import { ViewTypeService } from '../view-type.service';
import { LsStrategy } from './ls-strategy.model';
import { CdService } from '../cd.service';

export const enum STATUS {
  LS_START,
  LS_END
};

export const EXCLUDED_FILES = [
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

  onLs = new Subject<{ status: STATUS, fileList?: Folder }>();

  constructor(
    private cdService: CdService,
    private thumbnailService: ThumbnailService,
    private viewTypeService: ViewTypeService,
    private zone: NgZone,
  ) {
    this.cdService.onCd.subscribe(currentFolder => {
      this.ls(currentFolder.path);
    });
  }

  /**
   * TODO: doc
   * @param folderPath 
   */
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
            return fileName[0] !== '.' && EXCLUDED_FILES.indexOf(fileName) === -1;
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

  /**
   * TODO: doc
   * @param folderPath 
   * @param lsStrategy 
   * @param depth 
   */
  private buildList(folderPath: string, lsStrategy: LsStrategy, depth = 0) {
    return new Promise<Folder>(async (resolve, reject) => {
      const fileList = await this.__ls(folderPath);
      
      if (await lsStrategy.continue(fileList, depth)) {
        for (let innerFolder of fileList.folders) {
          await this.buildList(innerFolder.path, lsStrategy, ++depth);
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

  /**
   * TODO: doc
   * @param folderPath 
   */
  async ls(folderPath: string) {
    this.onLs.next({ status: STATUS.LS_START });

    let fileList;
    const viewType = this.viewTypeService.getViewType();

    if (this.strategyCache[viewType.id] && this.strategyCache[viewType.id][folderPath]) {
      fileList = this.strategyCache[viewType.id][folderPath];
    }
    else {
      viewType.strategy.init(folderPath);
      await this.buildList(folderPath, viewType.strategy);
      fileList = viewType.strategy.getResult();

      // Setting cache
      if (!this.strategyCache[viewType.id]) this.strategyCache[viewType.id] = {};
      this.strategyCache[viewType.id][folderPath] = fileList;
    }

    this.thumbnailService.setThumbnails(fileList);
    this.onLs.next({ status: STATUS.LS_END, fileList: fileList });
  }

}
