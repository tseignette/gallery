import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Image, Video } from '../models';

export const enum ACTIONS {
  CLOSE,
  NEXT,
  OPEN,
  PREVIOUS,
};

@Injectable({
  providedIn: 'root'
})
export class SlideshowService {

  private isOpen = false;

  onAction = new Subject<{ action: ACTIONS, data?: any }>();

  constructor() { }

  close() {
    this.isOpen = false;
    this.onAction.next({ action: ACTIONS.CLOSE });
  }

  next() {
    if (this.isOpen) this.onAction.next({ action: ACTIONS.NEXT });
  }

  open(index: number, medias: (Image|Video)[]) {
    this.isOpen = true;
    this.onAction.next({ action: ACTIONS.OPEN, data: { index, medias } });
  }

  previous() {
    if (this.isOpen) this.onAction.next({ action: ACTIONS.PREVIOUS });
  }

}
