import { HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import {
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { filter, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { DEFAULT_LANGUAGE, Languages, LOCALES } from '../core/models/languages.enum';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private httpBackend: HttpBackend) {}

  getTranslation(lang: string) {
    const httpRequest = new HttpRequest('GET', `assets/i18n/${lang}.json?v=${new Date().getTime()}`);

    return this.httpBackend.handle(httpRequest).pipe(
      filter(httpEvent => httpEvent instanceof HttpResponse),
      map(httpResponse => (httpResponse as HttpResponse<any>).body),
    );
  }
}

@NgModule({
  exports: [TranslocoModule],
  imports: [
    TranslocoLocaleModule.forRoot({
      langToLocaleMapping: LOCALES,
    }),
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: Object.values(Languages),
        defaultLang: DEFAULT_LANGUAGE,
        fallbackLang: DEFAULT_LANGUAGE,
        prodMode: environment.production,
        reRenderOnLangChange: true,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class LanguageModule {}
