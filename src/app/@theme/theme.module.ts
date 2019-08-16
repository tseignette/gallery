import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent, LayoutComponent, AsideComponent, HeaderComponent, ButtonLinkComponent, PathComponent, FolderComponent, MediaComponent } from './components';
import { NgForObjectPipe } from './pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [
  ButtonLinkComponent,
  AsideComponent,
  FolderComponent,
  HeaderComponent,
  LayoutComponent,
  MediaComponent,
  NotFoundComponent,
  PathComponent,
];

const DIRECTIVES = [
  // Add directives here
];

const PIPES = [
  NgForObjectPipe,
];

const PROVIDERS = [
  // Add services here
];

const IMPORTS = [
  CommonModule,
];

const BASE_MODULES = [
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
    ...BASE_MODULES,
  ],
  imports: [
    ...IMPORTS,
    ...BASE_MODULES,
  ]
})
export class ThemeModule {

  constructor() { }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }

}
