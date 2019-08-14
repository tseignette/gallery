import { Component, OnInit, OnDestroy } from '@angular/core';
import { GalleryService } from '../../../../@core/services';
import { Subscription } from 'rxjs';
import { Folder } from '../../../../@core/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private currentFolderUpdateSub: Subscription;

  private galleryUpdateSub: Subscription;

  currentFolder: Folder;

  galleryFolder: Folder;

  constructor(
    private galleryService: GalleryService,
  ) { }

  ngOnInit() {
    this.currentFolderUpdateSub = this.galleryService.onCurrentFolderUpdate.subscribe(
      (currentFolder) => {
        this.currentFolder = currentFolder;
      }
    );

    this.galleryUpdateSub = this.galleryService.onGalleryUpdate.subscribe(
      (galleryFolder) => {
        this.galleryFolder = galleryFolder;
      }
    );
  }

  ngOnDestroy() {
    if (this.currentFolderUpdateSub) {
      this.currentFolderUpdateSub.unsubscribe();
    }

    if (this.galleryUpdateSub) {
      this.galleryUpdateSub.unsubscribe();
    }
  }

  selectGallery() {
    this.galleryService.selectGallery();
  }

}
