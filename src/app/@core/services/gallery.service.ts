import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { remote } from 'electron';
import { Folder } from '../models';
import { ThumbnailService } from './thumbnail.service';
import { SettingsService } from './settings.service';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private currentFolder: Folder;

  /**
   * Prevent opening several folder select windows
   */
  private isChoosingGallery = false;

  private gallery: Folder;

  onCurrentFolderUpdate = new Subject<Folder>();

  onGalleryUpdate = new Subject<Folder>();

  constructor(
    private settingsService: SettingsService,
    private thumbnailService: ThumbnailService,
    private zone: NgZone,
  ) {
    this.restoreLastGalleryOpened();
  }

  private setGallery(galleryPath: string) {
    const folder = new Folder(galleryPath);
    this.gallery = folder;
    this.settingsService.set('galleryPath', galleryPath);
    this.thumbnailService.setGallery(folder);
    this.onGalleryUpdate.next(folder);
    this.cd(folder);
  }

  private restoreLastGalleryOpened() {
    setTimeout(() => { // Wait for electron to be ready
      const lastGallery = this.settingsService.get('galleryPath');

      if (lastGallery) {
        // Checking folder existence
        fs.access(lastGallery, error => {
          if (error) return;

          this.zone.run(() => {
            this.setGallery(lastGallery);
          });
        });
      }
    });
  }

  cd(folder: Folder, forceUpdate = false) {
    // Remove useless '/' if there is one
    if (folder.path.slice(-1) === '/') {
      folder = new Folder(folder.path.slice(0, -1));
    }

    // Navigate only if current folder isn't defined or if it's different than next folder
    if (forceUpdate || !this.currentFolder || folder.path !== this.currentFolder.path) {
      this.currentFolder = folder;
      this.onCurrentFolderUpdate.next(folder);
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

  getCurrentFolder() {
    if (this.currentFolder) this.onCurrentFolderUpdate.next(this.currentFolder);
  }

  goBackHome() {
    if (this.gallery) this.cd(this.gallery, true);
  }

}
