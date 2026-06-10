import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Translation, TranslocoService } from '@ngneat/transloco';

/**
 * Class for localization title's, button's etc.
 * getLanguageFromStorage() for getting current language system which user choose on login page
 * getLocalTextFromKey(key: sting, locale?: string) for getting local message by key (for optional locale)
 */
@Injectable({ providedIn: 'root' })
export class Localization {
  public static readonly STORAGE_LANGUAGE_KEY = 'language';

  public static readonly LANG_RU = 'ru';
  public static readonly LANG_EN = 'en';
  public static readonly LANG_KZ = 'kk';

  public static readonly DEFAULT_LANG = Localization.LANG_EN;

  constructor(
    private translocoService: TranslocoService,
    private dateAdapter: DateAdapter<any>,
  ) {}

  public setActiveLang(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }

  public changeLanguage(lang: string): void {
    localStorage.setItem(Localization.STORAGE_LANGUAGE_KEY, lang);
    this.dateAdapter.setLocale(this.getLanguageFromStorage());
    this.setActiveLang(lang);
  }

  public getLocalFieldEnumName(): string {
    let lang = localStorage.getItem(Localization.STORAGE_LANGUAGE_KEY);

    if (!lang) {
      lang = Localization.DEFAULT_LANG;
    }

    switch (lang) {
      case Localization.LANG_RU:
        return 'nameRu';
      case Localization.LANG_KZ:
        return 'nameKz';
      case Localization.LANG_EN:
      default:
        return 'nameEn';
    }
  }

  public getLanguageFromStorage(): string {
    const storageLanguage = localStorage.getItem(Localization.STORAGE_LANGUAGE_KEY);

    return storageLanguage ? storageLanguage : Localization.DEFAULT_LANG;
  }

  public getLocalTextFromKey(key: string, lang?: string): string {
    return this.getLocalFormattedTextFromKey(key, null, lang);
  }

  public getLocalFormattedTextFromKey(key: string, paramsMap?: Map<string, string>, lang?: string): string {
    const language = lang ? lang : this.getLanguageFromStorage(),
      params = paramsMap ? Object.fromEntries(paramsMap) : paramsMap;

    return this.translocoService.translate(key, params, language);
  }

  public getMessages(lang?: string): Translation {
    if (!lang) {
      this.translocoService.getTranslation();
    }

    return this.translocoService.getTranslation(lang);
  }
}
