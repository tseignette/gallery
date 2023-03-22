import { Component, OnInit } from '@angular/core';
import { FileService } from './shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private currentFolderSub: Subscription;

  private rootFolderSub: Subscription;

  MENU = [
    { class: 'far fa-folder', type: 'folder' },
    { class: 'far fa-calendar-alt', type: 'calendar' },
    { class: 'fas fa-bars', type: 'list' },
  ];

  folders: string[];

  rootFolder: string;

  viewType = this.MENU[0].type;

  constructor(
    private fileService: FileService,
  ) { }

  ngOnInit() {
    this.currentFolderSub = this.fileService.onCd.subscribe(
      (currentFolderAbsolute: string) => {
        const currentFolderRelative = currentFolderAbsolute.substr(this.rootFolder.length + 1);
        this.buildFolders(currentFolderRelative);
      }
    );

    this.rootFolderSub = this.fileService.onRootFolderChange.subscribe(
      (rootFolder: string) => {
        this.rootFolder = rootFolder;

        this.buildFolders();
      }
    );
  }

  ngOnDestroy() {
    if (this.currentFolderSub) {
      this.currentFolderSub.unsubscribe();
    }

    if (this.rootFolderSub) {
      this.rootFolderSub.unsubscribe();
    }
  }

  private buildFolders(currentFolderRelative?: string) {
    this.folders = this.rootFolder.split('/').slice(-1);

    
    if (currentFolderRelative) {
      this.folders = this.folders.concat(currentFolderRelative.split('/'));
    }
  }

  selectRootFolder() {
    this.fileService.selectRootFolder();
  }

  cd(index: number) {
    if (index === this.folders.length - 1) {
      return;
    }

    let dest = this.rootFolder + '/';
    dest += this.folders.slice(1, index + 1).join('/');
    this.fileService.cd(dest);
  }

}
