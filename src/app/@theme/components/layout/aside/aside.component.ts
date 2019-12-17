import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProgressService } from '../../../../@core/services';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit, OnDestroy {

  private onProgressUpdateSub: Subscription;

  progress = -1;

  label = '';

  constructor(
    private progressService: ProgressService,
  ) { }

  ngOnInit() {
    this.onProgressUpdateSub = this.progressService.onProgressUpdate.subscribe(info => {
      this.label = info.title;
      this.progress = info.progress;
    });
  }

  ngOnDestroy() {
    if (this.onProgressUpdateSub) {
      this.onProgressUpdateSub.unsubscribe();
    }
  }

}
