import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProgressService, ViewTypeService, VIEW_TYPES } from '../../../../@core/services';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit, OnDestroy {

  private onProgressUpdateSub: Subscription;

  private onViewTypeUpdateSub: Subscription;

  progress = -1;

  label = '';

  VIEWS = VIEW_TYPES;

  viewType: string;

  constructor(
    private progressService: ProgressService,
    private viewTypeService: ViewTypeService,
  ) { }

  ngOnInit() {
    this.onProgressUpdateSub = this.progressService.onProgressUpdate.subscribe(info => {
      this.label = info.title;
      this.progress = info.progress;
    });

    this.onViewTypeUpdateSub = this.viewTypeService.onViewTypeUpdate.subscribe(viewType => {
      this.viewType = viewType.id;
    });

    this.viewTypeService.getViewType();
  }

  ngOnDestroy() {
    if (this.onProgressUpdateSub) {
      this.onProgressUpdateSub.unsubscribe();
    }
    if (this.onViewTypeUpdateSub) {
      this.onViewTypeUpdateSub.unsubscribe();
    }
  }

  chooseView(viewType: string) {
    this.viewTypeService.setViewType(viewType);
  }

}
