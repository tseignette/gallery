import { Injectable } from '@angular/core';
import * as settings from 'electron-app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  set(name: string, data: any) {
    settings.set(name, data);
  }

  get(name: string): any {
    return settings.get(name);
  }

}
