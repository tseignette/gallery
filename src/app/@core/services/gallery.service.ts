import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { remote } from 'electron';
import { Folder } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private currentFolder: Folder;

  /**
   * Prevent opening several folder select windows
   */
  private isChoosingGallery = false;

  onCurrentFolderUpdate = new Subject<Folder>();

  onGalleryUpdate = new Subject<Folder>();

  constructor(
    private zone: NgZone,
  ) { }

  cd(folder: Folder) {
    // Remove useless '/' if there is one
    if (folder.path.slice(-1) === '/') {
      folder = new Folder(folder.path.slice(0, -1));
    }

    // Navigate only if current folder isn't defined or if it's different than next folder
    if (!this.currentFolder || folder.path !== this.currentFolder.path) {
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
            const folder = new Folder(galleryPath);
            this.onGalleryUpdate.next(folder);
            this.cd(folder);
          });
        }
      },
    );
  }

}
