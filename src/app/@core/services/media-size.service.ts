import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const MEDIA_BOOTSTRAP_SIZES = [ 1, 2, 3, 4, 6, 12 ];

@Injectable({
  providedIn: 'root'
})
export class MediaSizeService {

  private size: number;

  onMediaSizeUpdate = new Subject<number>();

  constructor() { }

  getSize() {
    this.onMediaSizeUpdate.next(this.size);
  }

  setSize(size: number) {
    this.size = MEDIA_BOOTSTRAP_SIZES[Math.floor(size * (MEDIA_BOOTSTRAP_SIZES.length - 1) / 100)];
    this.getSize();
  }

}
