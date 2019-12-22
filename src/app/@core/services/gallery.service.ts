import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { remote } from 'electron';
import { Folder } from '../models';
import { SettingsService } from './settings.service';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  /**
   * Prevent opening several folder select windows
   */
  private isChoosingGallery = false;

  onGalleryUpdate = new Subject<Folder>();

  constructor(
    private settingsService: SettingsService,
    private zone: NgZone,
  ) {
    this.restoreLastGalleryOpened();
  }

  private setGallery(galleryPath: string) {
    const folder = new Folder(galleryPath);
    this.settingsService.set('galleryPath', galleryPath);
    this.onGalleryUpdate.next(folder);
  }

  private async restoreLastGalleryOpened() {
    const lastGallery = await this.settingsService.get('galleryPath');

    if (lastGallery) {
      // Checking folder existence
      fs.access(lastGallery, error => {
        if (error) return;

        this.zone.run(() => {
          this.setGallery(lastGallery);
        });
      });
    }
  }

  selectGallery() {
    // If gallery is already being chosen, stop
    if (this.isChoosingGallery) return;

    this.isChoosingGallery = true;

    remote.dialog.showOpenDialog(
      {
        title:"Select a folder",
        properties: [ "openDirectory" ],
      },
      (folderPaths: string[]) => {
        this.isChoosingGallery = false;

        const galleryPath = folderPaths && folderPaths.length ?
          folderPaths[0] : undefined

        // If no folder has been chosen
        if (!galleryPath) {
          alert('No folder has been chosen')
        }
        else {
          this.zone.run(() => {
            this.setGallery(galleryPath);
          });
        }
      },
    );
  }

}
