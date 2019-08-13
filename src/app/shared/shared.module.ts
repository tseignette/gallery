import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent, SectionComponent, FilesComponent } from './components';
import { NgForObjectPipe } from './pipes';
import { FormsModule } from '@angular/forms';
import { FileService, SettingsService, ThumbnailService } from './services';

@NgModule({
  declarations: [
    FilesComponent,
    NgForObjectPipe,
    PageNotFoundComponent,
    SectionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    FilesComponent,
    NgForObjectPipe,
    SectionComponent,
  ],
  providers: [
    FileService,
    SettingsService,
    ThumbnailService,
  ],
})
export class SharedModule {}
