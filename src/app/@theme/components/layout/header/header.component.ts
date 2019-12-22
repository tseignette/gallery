import { Component, OnInit, OnDestroy } from '@angular/core';
import { GalleryService, FileService, FilterService, CdService, STATUS } from '../../../../@core/services';
import { Subscription } from 'rxjs';
import { Folder, Filters } from '../../../../@core/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private onCdSub: Subscription;

  private onLsSub: Subscription;

  private onGalleryUpdate: Subscription;

  FILTERS_TEXT = {
    folder: 'folders',
    image: 'pictures',
    video: 'videos',
  };

  currentFolder: Folder;

  fileList: Folder;

  filters: Filters;

  galleryFolder: Folder;

  constructor(
    private cdService: CdService,
    private fileService: FileService,
    private filterService: FilterService,
    private galleryService: GalleryService,
  ) { }

  ngOnInit() {
    this.onCdSub = this.cdService.onCd.subscribe(
      (currentFolder) => {
        this.currentFolder = currentFolder;
      }
    );

    this.onLsSub = this.fileService.onLs.subscribe(info => {
      if (info.status === STATUS.LS_END)
      this.fileList = info.fileList;
    });

    this.onGalleryUpdate = this.galleryService.onGalleryUpdate.subscribe(
      (galleryFolder) => {
        this.galleryFolder = galleryFolder;
      }
    );

    this.filters = new Filters();
    this.onFilterUpdate();
  }

  ngOnDestroy() {
    if (this.onCdSub) {
      this.onCdSub.unsubscribe();
    }

    if (this.onLsSub) {
      this.onLsSub.unsubscribe();
    }

    if (this.onGalleryUpdate) {
      this.onGalleryUpdate.unsubscribe();
    }
  }

  selectGallery() {
    this.galleryService.selectGallery();
  }

  onFilterUpdate() {
    this.filterService.setFilters(this.filters);
  }

}
