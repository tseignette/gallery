import { Injectable } from '@angular/core';
import { remote } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private browserWindow = remote.getCurrentWindow();

  constructor() { }

  setProgressBar(done: number, leftTodo: number) {
    const progress = done / (leftTodo + done);

    // Progress bar is stuck at 100% if we don't set it to -1
    this.browserWindow.setProgressBar(progress === 1 ? -1 : progress);
  }

}
