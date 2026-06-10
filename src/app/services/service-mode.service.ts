import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceModeService {
  loadServiceMode(): Promise<void> {
    return Promise.resolve();
  }

  isServiceMode(): boolean {
    return false;
  }
}
