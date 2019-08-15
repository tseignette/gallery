import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileService, GalleryService } from '../@core/services';
import { Subscription } from 'rxjs';
import { Folder } from '../@core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private onCurrentFolderSub: Subscription;

  private onFileListSub: Subscription;

  fileList: Folder;

  constructor(
    private fileService: FileService,
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
  }

  ngOnDestroy() {
    if (this.onCurrentFolderSub) {
      this.onCurrentFolderSub.unsubscribe();
    }

    if (this.onFileListSub) {
      this.onFileListSub.unsubscribe();
    }
  }

  cd(folder: Folder) {
    this.galleryService.cd(folder);
  }

}
