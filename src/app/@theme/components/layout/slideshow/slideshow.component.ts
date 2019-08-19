import { Component, OnInit, OnDestroy } from '@angular/core';
import { SlideshowService, ACTIONS } from '../../../../@core/services';
import { Subscription } from 'rxjs';
import { Image, Video } from '../../../../@core/models';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit, OnDestroy {

  private onSlideshowAction: Subscription;

  index: number;

  medias: (Image|Video)[];

  open = false;

  constructor(
    private slideshowService: SlideshowService,
  ) { }

  ngOnInit() {
    this.onSlideshowAction = this.slideshowService.onAction.subscribe(info => {

      switch (info.action) {
        case ACTIONS.CLOSE:
          this.open = false;
          break;

        case ACTIONS.NEXT:
          if (this.index + 1 < this.medias.length) this.index++;
          break;

        case ACTIONS.OPEN:
          this.index = info.data.index;
          this.medias = info.data.medias;
          this.open = true;
          break;

        case ACTIONS.PREVIOUS:
          if (this.index) this.index--;
          break;

        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    if (this.onSlideshowAction) {
      this.onSlideshowAction.unsubscribe();
    }
  }

}