import { Injectable } from '@angular/core';
import { LsAllStrategy } from './ls/ls-all-strategy.model';
import { SettingsService } from './settings.service';
import { Subject } from 'rxjs';
import { LsStrategy } from './ls/ls-strategy.model';
import { LsFolderStrategy } from './ls/ls-folder-strategy.model';
import { LsEventStrategy } from './ls/ls-event-strategy.model';
import { SlideshowService } from './slideshow.service';

export interface ViewType {
  id: string,
  icon: string,
  name: string,
  strategy: LsStrategy,
}

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

  onViewTypeUpdate = new Subject<ViewType>();

  constructor(
    private settingsService: SettingsService,
    private slideshowService: SlideshowService,
  ) {
    this.restoreLastViewType();
  }

  private async restoreLastViewType() {
    this.setViewType(await this.settingsService.get('viewTypeId'));
  }

  getViewType() {
    if (this.viewTypeId) {
      return VIEW_TYPES[this.viewTypeId];
    }
  }

  setViewType(viewTypeId: string) {
    if (viewTypeId === this.viewTypeId) return;

    this.viewTypeId = viewTypeId;
    this.slideshowService.close();
    this.settingsService.set('viewTypeId', viewTypeId);
    this.onViewTypeUpdate.next(VIEW_TYPES[this.viewTypeId]);
  }

}
