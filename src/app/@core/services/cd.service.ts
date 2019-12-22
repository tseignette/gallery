import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Folder } from '../models';
import { GalleryService } from './gallery.service';
import { ViewTypeService, ViewType } from './view-type.service';

@Injectable({
  providedIn: 'root'
})
export class CdService {

  private currentFolder: Folder;

  private gallery: Folder;

  private viewType: ViewType;

  onCd = new Subject<Folder>();

  constructor(
    private galleryService: GalleryService,
    private viewTypeService: ViewTypeService,
  ) {
    this.galleryService.onGalleryUpdate.subscribe(gallery => {
      this.gallery = gallery;

      // Return if confitions are not met
      if (!this.areCdConditionsMet()) return;

      this.cd(gallery);
    });
    this.viewTypeService.onViewTypeUpdate.subscribe(viewType => {
      this.viewType = viewType;

      // Return if confitions are not met
      if (!this.areCdConditionsMet()) return;

      // Force cd in case we are still in the root folder (ls must be triggered)
      this.cd(this.gallery, true);
    });
  }

  /**
   * TODO: doc
   */
  private areCdConditionsMet(): boolean {
    return !!this.gallery && !!this.viewType;
  }

  /**
   * TODO: doc
   * @param folder 
   * @param forceUpdate 
   */
  cd(folder: Folder, forceUpdate = false) {
    // Remove useless '/' if there is one
    if (folder.path.slice(-1) === '/') {
      folder = new Folder(folder.path.slice(0, -1));
    }

    // Navigate only if current folder != next folder
    if (forceUpdate || !this.currentFolder || this.currentFolder.path !== folder.path) {
      this.currentFolder = folder;
      this.onCd.next(folder);
    }
  }

}
