import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileService } from '../../services';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {

  private folderPath: string;

  private onCd: Subscription;

  @Input() viewType: string;

  files: any;

  showSection: any;

  constructor(
    private fileService: FileService,
  ) { }

  ngOnInit() {
    this.onCd = this.fileService.onCd.subscribe((folderPath: string) => {
      this.folderPath = folderPath;
      this.updateFiles();

      if (!this.showSection) {
        this.showSection = {};

        for (const key in this.files) {
          this.showSection[key] = true;
        }
      }
    });
  }

  ngOnChanges() {
    this.updateFiles();
  }

  ngOnDestroy() {
    if (this.onCd) {
      this.onCd.unsubscribe();
    }
  }

  private updateFiles() {
    if (!this.folderPath) {
      return;
    }

    switch (this.viewType) {
      case 'list':
        this.files = this.fileService.lsNested(this.folderPath);
        break;

      case 'folder':
      case 'calendar':
      default:
        this.files = this.fileService.ls(this.folderPath);
        break;
    }
  }

}
