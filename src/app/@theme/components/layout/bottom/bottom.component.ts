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

  ngOnInit() {
    setTimeout(() => { // Wait for electron to be ready
      const settingsSize = this.settingsService.get('mediaSize');
      this.size = settingsSize ? settingsSize : 20;
      this.onSizeChange();
    })
  }

  onSizeChange() {
    this.settingsService.set('mediaSize', this.size);
    this.mediaSizeService.setSize(this.size);
  }

}
