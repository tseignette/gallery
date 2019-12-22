import { Injectable } from '@angular/core';
import * as settings from 'electron-app-settings';

export const DEFAULT_SETTINGS = {
  mediaSize: 20,
  viewTypeId: 'folder',
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  set(name: string, data: any) {
    settings.set(name, data);
  }

  async get(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Wait for Electron to be ready
        const setting = settings.get(name);
        resolve((setting !== null && setting !== undefined) ? setting : DEFAULT_SETTINGS[name]);
      });
    });
  }

}
