import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GalleryService } from '../../../@core/services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private onGalleryUpdateSub: Subscription;

  isGalleryFolderChosen: boolean;

  constructor(
    private galleryService: GalleryService,
  ) { }

  ngOnInit() {
    this.onGalleryUpdateSub = this.galleryService.onGalleryUpdate.subscribe(galleryFolder => {
      this.isGalleryFolderChosen = !!galleryFolder;
    });
  }

  ngOnDestroy() {
    if (this.onGalleryUpdateSub) {
      this.onGalleryUpdateSub.unsubscribe();
    }
  }

  selectGallery() {
    this.galleryService.selectGallery();
  }

}
