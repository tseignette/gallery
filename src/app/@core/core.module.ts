import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { GalleryService, FileService, FilterService, ThumbnailService, ProgressService, SlideshowService, SettingsService, MediaSizeService, ViewTypeService } from './services';

const BASE_MODULES = [
  CommonModule,
  HttpClientModule,
];

const PROVIDERS = [
  FileService,
  FilterService,
  GalleryService,
  MediaSizeService,
  ProgressService,
  SettingsService,
  SlideshowService,
  ThumbnailService,
  ViewTypeService,
];

@NgModule({
  declarations: [
  ],
  exports: [
    ...BASE_MODULES,
  ],
  imports: [
    ...BASE_MODULES,
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }
}
