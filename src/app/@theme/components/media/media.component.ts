import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Image, Video } from '../../../@core/models';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnChanges {

  @ViewChild('video', { static: false }) templateVideo: ElementRef;

  @Input() media: Image|Video;

  duration: string;

  image: Image;

  video: Video;

  constructor() { }

  ngOnChanges() {
    if (!this.media) return;

    switch (this.media.type) {
      case 'image':
        this.image = <Image> this.media;
        break;

      case 'video':
        this.video = <Video> this.media;
        this.initVideo()
        break;

      default:
        break;
    }
  }

  private initVideo() {
    // Wait for video metadata to be ready
    let interval = setInterval(() => {
      // Metadata is available at readyState 1
      if (!this.video || this.templateVideo.nativeElement.readyState === 0) return;

      // Stopping interval
      clearInterval(interval);

      // Computing duration text
      const d = this.templateVideo.nativeElement.duration;
      const hours = Math.floor(d / 3600);
      const minutes = Math.floor(d / 60 - hours * 3600);
      const seconds = Math.floor(d - hours * 3600 - minutes * 60);

      this.duration =
        (hours ? hours + ':' : '') +
        minutes + ':' +
        seconds;

      this.templateVideo.nativeElement.playbackRate = 2;

      // Muting video
      this.templateVideo.nativeElement.muted = 'muted';
    }, 10);
  }

  play() {
    this.templateVideo.nativeElement.play();
  }

  pause() {
    this.templateVideo.nativeElement.pause();
  }

}
