import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private browserWindow = remote.getCurrentWindow();

  onProgressUpdate = new Subject<{ progress: number, title: string }>();

  constructor() { }

  setProgressBar(done: number, leftTodo: number, title?: string) {
    const progress = done / (leftTodo + done);

    // Progress bar is stuck at 100% if we don't set it to -1
    const output = progress === 1 ? -1 : progress;
    this.onProgressUpdate.next({ progress: output, title });
    this.browserWindow.setProgressBar(output);
  }

}
