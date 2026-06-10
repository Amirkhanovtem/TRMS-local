interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly NG_APP_ENV: string;
  readonly NG_APP_API_URL: string;
  [key: string]: any;
}

interface Window {
  IS_KC_APP_ROUTE?: boolean;
  APP_SUB_PATH?: string;
}
