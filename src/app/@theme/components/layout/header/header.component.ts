import { Component, OnInit, OnDestroy } from '@angular/core';
import { GalleryService, FileService, FilterService } from '../../../../@core/services';
import { Subscription } from 'rxjs';
import { Folder, Filters } from '../../../../@core/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private currentFolderUpdateSub: Subscription;

  private fileListSub: Subscription;

  private galleryUpdateSub: Subscription;

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
    private fileService: FileService,
    private filterService: FilterService,
    private galleryService: GalleryService,
  ) { }

  ngOnInit() {
    this.currentFolderUpdateSub = this.galleryService.onCurrentFolderUpdate.subscribe(
      (currentFolder) => {
        this.currentFolder = currentFolder;
      }
    );

    this.fileListSub = this.fileService.onFileList.subscribe((fileList) => {
      this.fileList = fileList;
    });

    this.galleryUpdateSub = this.galleryService.onGalleryUpdate.subscribe(
      (galleryFolder) => {
        this.galleryFolder = galleryFolder;
      }
    );

    this.filters = new Filters();
    this.onFilterUpdate();
  }

  ngOnDestroy() {
    if (this.currentFolderUpdateSub) {
      this.currentFolderUpdateSub.unsubscribe();
    }

    if (this.fileListSub) {
      this.fileListSub.unsubscribe();
    }

    if (this.galleryUpdateSub) {
      this.galleryUpdateSub.unsubscribe();
    }
  }

  selectGallery() {
    this.galleryService.selectGallery();
  }

  onFilterUpdate() {
    this.filterService.setFilters(this.filters);
  }

}
