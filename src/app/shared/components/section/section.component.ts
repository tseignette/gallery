import { Component, Input, HostListener, OnInit } from '@angular/core';
import { FileService } from '../../services';

export enum KEY_CODE {
  ESC = 27,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
}

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  @Input() type: string;

  @Input() items: Array<any>;

  fullscreen: number;

  titleIcon: string;

  constructor(
    private fileService: FileService,
  ) { }

  ngOnInit() {
    if (this.type) {
      this.titleIcon = 'fa-' + this.type.slice(0, -1);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.fullscreenPrevious();
    }
    else if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.fullscreenNext();
    }
    else if (event.keyCode === KEY_CODE.ESC) {
      this.closeFullscreen();
    }
  }

  cd(folder: string) {
    this.fileService.cd(folder);
  }

  openFullscreen(number: number) {
    this.fullscreen = number;
  }

  closeFullscreen() {
    this.fullscreen = undefined;
  }

  fullscreenPrevious() {
    if (this.fullscreen > 0) {
      this.fullscreen--;
    }
  }

  fullscreenNext() {
    if (this.fullscreen < this.items.length - 1) {
      this.fullscreen++;
    }
  }

}
