import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { LanguageService } from '@services/language.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DEFAULT_LANGUAGE } from '../core/models/languages.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isSameOriginUrl(req)) {
      return this.processRequestWithToken(req, next, undefined);
    }

    return this.authService.getAccessToken().pipe(
      mergeMap(token => {
        return this.processRequestWithToken(req, next, token);
      }),
    );
  }

  private processRequestWithToken(req: HttpRequest<any>, next: HttpHandler, token: string | undefined) {
    let modifiedReq = req;
    const isFormData = req.body instanceof FormData;
    const activeLang = this.languageService.getSavedLang() || DEFAULT_LANGUAGE;

    let headers = req.headers.set('Accept-Language', activeLang);

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    modifiedReq = req.clone({
      headers,
      withCredentials: true,
    });

    return next.handle(modifiedReq).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
    );
  }

  private isSameOriginUrl(req: any) {
    // It's an absolute url with the same origin.
    if (req.url.startsWith(`${window.location.origin}/api`)) {
      return true;
    }

    if (req.url.startsWith(`//${window.location.host}/api`)) {
      return true;
    }

    if (req.url.startsWith('/api') || req.url.includes('/api')) {
      return true;
    }

    return false;
  }
}
