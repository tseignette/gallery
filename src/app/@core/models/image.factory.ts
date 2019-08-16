import { Injectable } from '@angular/core';
import { Image } from './image.model';
import { ThumbnailService } from '../services/thumbnail.service';

@Injectable({
  providedIn: 'root'
})
export class ImageFactory {

  constructor(
    private thumbnailService: ThumbnailService,
  ) { }

  createImage(imagePath: string): Image {
    const image = new Image(imagePath);

    this.thumbnailService.setImageThumbnail(image);

    return image;
  }

}
