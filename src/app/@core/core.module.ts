import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { GalleryService, FileService, FilterService, ThumbnailService, ProgressService, SlideshowService, SettingsService } from './services';

const BASE_MODULES = [
  CommonModule,
  HttpClientModule,
];

const PROVIDERS = [
  FileService,
  FilterService,
  GalleryService,
  ProgressService,
  SettingsService,
  SlideshowService,
  ThumbnailService,
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
