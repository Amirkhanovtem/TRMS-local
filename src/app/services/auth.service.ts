import { Injectable } from '@angular/core';
import { deleteCookie, getCookie } from '@utils/cookies';
import { KeycloakService } from 'keycloak-angular';
import { from, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  getAccessToken(): Observable<string> {
    if (this.isMobileAuth()) {
      const mobileToken = localStorage.getItem('mobile_access_token');

      if (mobileToken && this.isTokenValid(mobileToken)) {
        return of(mobileToken);
      }

      const cookieToken = getCookie('access_token');
      if (cookieToken && this.isTokenValid(cookieToken)) {
        localStorage.setItem('mobile_access_token', cookieToken);
        return of(cookieToken);
      }

      return throwError(() => new Error('Mobile token expired'));
    }

    return from(this.keycloakService.getToken());
  }

  isMobileAuth(): boolean {
    return localStorage.getItem('is_mobile_auth') === 'true';
  }

  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now() + 30000;
    } catch {
      return false;
    }
  }

  getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  mobileLogout(): void {
    localStorage.removeItem('is_mobile_auth');
    localStorage.removeItem('mobile_access_token');
    localStorage.removeItem('mobile_refresh_token');
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('language');
    deleteCookie('hide_header');
  }

  logout(): void {
    if (this.isMobileAuth()) {
      this.mobileLogout();
      window.location.reload();
    } else {
      this.keycloakService.logout();
    }
  }
}
