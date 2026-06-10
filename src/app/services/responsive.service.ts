import { Injectable, OnDestroy } from '@angular/core';
import { APP_CONSTANTS } from '@config/app.constants';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service to handle responsive design logic across the application
 * Provides a centralized way to detect and react to mobile/desktop views
 */
@Injectable({ providedIn: 'root' })
export class ResponsiveService implements OnDestroy {
  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth <= APP_CONSTANTS.MOBILE_BREAKPOINT);

  public isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();
  private resizeListener: () => void;

  constructor() {
    this.resizeListener = () => this.checkMobileView();
    window.addEventListener('resize', this.resizeListener);
  }

  private checkMobileView(): void {
    const isMobile = window.innerWidth <= APP_CONSTANTS.MOBILE_BREAKPOINT;
    if (this.isMobileSubject.value !== isMobile) {
      this.isMobileSubject.next(isMobile);
    }
  }

  public get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
