import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public static readonly STORAGE_LANGUAGE_KEY: string = 'language';

  constructor(
    private translocoService: TranslocoService,
    private dateAdapter: DateAdapter<any>,
  ) {}

  setActiveLang(lang: string): void {
    localStorage.setItem(LanguageService.STORAGE_LANGUAGE_KEY, lang);
    this.translocoService.setActiveLang(lang);
    this.dateAdapter.setLocale(lang);
  }

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }

  getSavedLang(): string {
    return localStorage.getItem(LanguageService.STORAGE_LANGUAGE_KEY);
  }
}
