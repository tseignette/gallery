import { Component, OnInit } from '@angular/core';
import { MediaSizeService, SettingsService } from '../../../../@core/services';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss']
})
export class BottomComponent implements OnInit {

  size: number;

  constructor(
    private mediaSizeService: MediaSizeService,
    private settingsService: SettingsService,
  ) { }

  async ngOnInit() {
    this.size = await this.settingsService.get('mediaSize');
    this.onSizeChange();
  }

  onSizeChange() {
    this.settingsService.set('mediaSize', this.size);
    this.mediaSizeService.setSize(this.size);
  }

}
