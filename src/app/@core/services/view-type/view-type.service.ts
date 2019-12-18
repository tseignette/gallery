import { Injectable } from '@angular/core';
import { LsAllStrategy } from '../file/ls-all-strategy.model';
import { SettingsService } from '../settings.service';
import { Subject } from 'rxjs';
import { LsStrategy } from '../file/ls-strategy.model';
import { LsFolderStrategy } from '../file/ls-folder-strategy.model';
import { GalleryService } from '../gallery.service';
import { LsEventStrategy } from '../file/ls-event-strategy.model';

export interface VIEW_TYPE {
  id: string,
  icon: string,
  name: string,
  strategy: LsStrategy,
}

export const DEFAULT_VIEW_TYPE = 'folder';

export const VIEW_TYPES = {
  all: { id: 'all', icon: 'fas fa-th', name: 'Everything', strategy: new LsAllStrategy() },
  event: { id: 'event', icon: 'fas fa-calendar-day', name: 'Event', strategy: new LsEventStrategy() },
  folder: { id: 'folder', icon: 'fas fa-folder', name: 'Folder', strategy: new LsFolderStrategy() },
};

@Injectable({
  providedIn: 'root'
})
export class ViewTypeService {

  private viewTypeId: string;

  onViewTypeUpdate = new Subject<VIEW_TYPE>();

  constructor(
    private galleryService: GalleryService,
    private settingsService: SettingsService,
  ) {
    this.restoreLastViewType();
  }

  private restoreLastViewType() {
    setTimeout(() => { // Wait for electron to be ready
      const lastViewTypeId = this.settingsService.get('viewTypeId');

      this.setViewType(lastViewTypeId ? lastViewTypeId : DEFAULT_VIEW_TYPE);
    });
  }

  getViewType() {
    if (this.viewTypeId) {
      this.onViewTypeUpdate.next(VIEW_TYPES[this.viewTypeId]);
    }
  }

  setViewType(viewTypeId: string) {
    if (viewTypeId === this.viewTypeId) return;

    this.viewTypeId = viewTypeId;
    this.settingsService.set('viewTypeId', viewTypeId);
    this.getViewType();
    this.galleryService.goBackHome();
  }

}
