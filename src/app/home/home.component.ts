import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FileService, GalleryService, FilterService, SlideshowService, MediaSizeService } from '../@core/services';
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

  private onCurrentFolderSub: Subscription;

  private onFileListSub: Subscription;

  private onFilterSub: Subscription;

  private onMediaSizeSub: Subscription;

  fileList: Folder;

  filters: Filters;

  sizeClass: string;

  constructor(
    private fileService: FileService,
    private filterService: FilterService,
    private galleryService: GalleryService,
    private mediaSizeService: MediaSizeService,
    private slideshowService: SlideshowService,
  ) { }

  ngOnInit() {
    this.onCurrentFolderSub = this.galleryService.onCurrentFolderUpdate.subscribe(
      (currentFolder) => {
        this.fileService.ls(currentFolder);
      }
    );

    this.onFileListSub = this.fileService.onFileList.subscribe((fileList) => {
      this.fileList = fileList;
    });

    this.onFilterSub = this.filterService.onFiltersUpdate.subscribe((filters) => {
      this.filters = filters;
    });

    this.onMediaSizeSub = this.mediaSizeService.onMediaSizeUpdate.subscribe((size) => {
      this.sizeClass = 'col-' + size;
    });

    this.galleryService.getCurrentFolder();
    this.filterService.getFilters();
    this.mediaSizeService.getSize();
  }

  ngOnDestroy() {
    if (this.onCurrentFolderSub) {
      this.onCurrentFolderSub.unsubscribe();
    }

    if (this.onFileListSub) {
      this.onFileListSub.unsubscribe();
    }

    if (this.onFilterSub) {
      this.onFilterSub.unsubscribe();
    }

    if (this.onMediaSizeSub) {
      this.onMediaSizeSub.unsubscribe();
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
    this.galleryService.cd(folder);
  }

  openSlideshow(index: number, currentTime: number) {
    this.slideshowService.open(index, currentTime, this.fileList.medias);
  }

}
