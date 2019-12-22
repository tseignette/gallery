import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FileService, FilterService, SlideshowService, MediaSizeService, CdService, STATUS } from '../@core/services';
import { Subscription } from 'rxjs';
import { Folder, Filters } from '../@core/models';

export enum KEY_CODE {
  ESC = 27,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private onCdSub: Subscription;

  private onLsSub: Subscription;

  private onFiltersUpdateSub: Subscription;

  private onMediaSizeUpdateSub: Subscription;

  fileList: Folder;

  filters: Filters;

  loading = true;

  sizeClass: string;

  constructor(
    private cdService: CdService,
    private fileService: FileService,
    private filterService: FilterService,
    private mediaSizeService: MediaSizeService,
    private slideshowService: SlideshowService,
  ) { }

  ngOnInit() {
    this.onLsSub = this.fileService.onLs.subscribe(info => {
      switch (info.status) {
        case STATUS.LS_START:
          this.loading = true;
          delete this.fileList;
          break;

        case STATUS.LS_END:
          this.loading = false;
          this.fileList = info.fileList;
          break;
      }
    });

    this.onFiltersUpdateSub = this.filterService.onFiltersUpdate.subscribe((filters) => {
      this.filters = filters;
    });

    this.onMediaSizeUpdateSub = this.mediaSizeService.onMediaSizeUpdate.subscribe((size) => {
      this.sizeClass = 'col-' + size;
    });

    this.filterService.getFilters();
    this.mediaSizeService.getSize();
  }

  ngOnDestroy() {
    if (this.onCdSub) {
      this.onCdSub.unsubscribe();
    }

    if (this.onLsSub) {
      this.onLsSub.unsubscribe();
    }

    if (this.onFiltersUpdateSub) {
      this.onFiltersUpdateSub.unsubscribe();
    }

    if (this.onMediaSizeUpdateSub) {
      this.onMediaSizeUpdateSub.unsubscribe();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.ESC:
        this.slideshowService.close();
        break;

      case KEY_CODE.LEFT_ARROW:
        this.slideshowService.previous();
        break;

      case KEY_CODE.RIGHT_ARROW:
        this.slideshowService.next();
        break;

      default:
        break;
    }
  }

  cd(folder: Folder) {
    this.cdService.cd(folder);
  }

  openSlideshow(index: number, currentTime: number) {
    this.slideshowService.open(index, currentTime, this.fileList.medias);
  }

}
