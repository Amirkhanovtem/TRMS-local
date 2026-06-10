import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LOCAL_STORAGE_KEYS } from '../constants/local-storage-keys';
import { DEFAULT_LANGUAGE } from '../core/models/languages.enum';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const language = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;

    return next.handle(
      request.clone({
        headers: request.headers.set('Accept-Language', language.toLowerCase()),
      }),
    );
  }
}
