import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileService, GalleryService, FilterService } from '../@core/services';
import { Subscription } from 'rxjs';
import { Folder, Filters } from '../@core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private onCurrentFolderSub: Subscription;

  private onFileListSub: Subscription;

  private onFilterSub: Subscription;

  fileList: Folder;

  filters: Filters;

  constructor(
    private fileService: FileService,
    private filterService: FilterService,
    private galleryService: GalleryService,
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

    this.filterService.getFilters();
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
  }

  cd(folder: Folder) {
    this.galleryService.cd(folder);
  }

}
