import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Image, Video } from '../../../@core/models';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnChanges {

  @ViewChild('video', { static: false }) video: ElementRef;

  @Input() media: Image|Video;

  duration: string;

  constructor() { }

  ngOnChanges() {
    if (!this.media) return;

    if (this.media.type === 'video') this.initVideo();
  }

  private initVideo() {
    // Wait for video metadata to be ready
    let interval = setInterval(() => {
      // Metadata is available at readyState 1
      if (!this.video || this.video.nativeElement.readyState === 0) return;

      // Stopping interval
      clearInterval(interval);

      // Computing duration text
      const d = this.video.nativeElement.duration;
      const hours = Math.floor(d / 3600);
      const minutes = Math.floor(d / 60 - hours * 3600);
      const seconds = Math.floor(d - hours * 3600 - minutes * 60);

      this.duration =
        (hours ? hours + ':' : '') +
        minutes + ':' +
        seconds;

      this.video.nativeElement.playbackRate = 2;

      // Muting video
      this.video.nativeElement.muted = 'muted';
    });
  }

  play() {
    this.video.nativeElement.play();
  }

  pause() {
    this.video.nativeElement.pause();
  }

}
