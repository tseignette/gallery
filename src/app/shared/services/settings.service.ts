import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings = require('electron-app-settings');

  constructor() { }

  set(name: string, data: any) {
    this.settings.set(name, data);
  }

  get(name: string): any {
    return this.settings.get(name);
  }

}
