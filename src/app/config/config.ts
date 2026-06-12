import { getBasePath } from '@utils/base-path';
import { IndividualConfig } from 'ngx-toastr';

import { environment } from '../../environments/environment';

export class Config {
  public static get URL(): string {
    if (!environment.production && environment.envVar.apiBaseUrl && environment.envVar.apiBaseUrl !== 'VAR_APP_API_URL') {
      return environment.envVar.apiBaseUrl.replace(/\/$/, '');
    }

    return `${getBasePath()}/api`;
  }

  public static get LOGIN_URL(): string {
    return `${Config.URL}/auth/login`;
  }

  public static get SWAGGER_URL(): string {
    return `${Config.URL}/swagger-ui/index.html`;
  }

  public static readonly REQUIRE_HTTPS = true;
  public static readonly NOTIFICATION_DURATION = 1000 * 15; // in milliseconds
  public static readonly GANTT_AUTO_REFRESH_INTERVAL = process.env.NG_APP_GANTT_AUTO_REFRESH_INTERVAL || 60 * 5; // in seconds
  public static readonly TOAST_CONFIG: Partial<IndividualConfig> = {
    timeOut: Config.NOTIFICATION_DURATION,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    newestOnTop: false,
    tapToDismiss: false,
    disableTimeOut: 'extendedTimeOut',
  };

  public static readonly KEYCLOAK_URL = environment.envVar.keycloakUrl;
  public static readonly KEYCLOAK_REALM = environment.envVar.realm;
  public static readonly KEYCLOAK_CLIENT_ID = environment.envVar.clientId;

  public static get MAIN_API_URL(): string {
    return Config.URL;
  }

  public static get MAIN_API_ENUM_URL(): string {
    return `${Config.MAIN_API_URL}/enums`;
  }

  public static get MAIN_API_FILE_STORAGE_LOAD_FILE_URL(): string {
    return `${Config.MAIN_API_URL}/files/download`;
  }

  public static readonly ALLOWED_WORD_FILE_FORMATS =
    '.doc, application/msword, ' +
    '.docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, ' +
    '.docm, application/vnd.ms-word.document.macroEnabled.12, ' +
    '.dotx, application/vnd.openxmlformats-officedocument.wordprocessingml.template';

  public static readonly ALLOWED_HISTORICAL_DATA_FORMATS =
    '.xls, application/vnd.ms-excel, ' +
    '.xlt, .xla, ' +
    '.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, ' +
    '.xltx, application/vnd.openxmlformats-officedocument.spreadsheetml.template, ' +
    '.xlsm, application/vnd.ms-excel.sheet.macroEnabled.12, ' +
    '.xltm, application/vnd.ms-excel.template.macroEnabled.12, ' +
    '.xlam, application/vnd.ms-excel.addin.macroEnabled.12, ' +
    '.xlsb, application/vnd.ms-excel.sheet.binary.macroEnabled.12';
}
