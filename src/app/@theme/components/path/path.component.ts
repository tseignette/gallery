import { Component, OnChanges, Input } from '@angular/core';
import { Folder } from '../../../@core/models';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent implements OnChanges {

  @Input() baseFolder: Folder;

  @Input() folder: Folder;

  path: string[];

  constructor() { }

  ngOnChanges() {
    if (!this.folder) return;

    // If there is no base folder, display all the path
    const baseFolder = this.baseFolder ? this.baseFolder : new Folder('/');

    this.path = this.folder.path.substr(baseFolder.parent.length).split('/').splice(1);
  }

}