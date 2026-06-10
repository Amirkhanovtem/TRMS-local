export const APP_SUB_PATH = (window as any).APP_SUB_PATH || '/trms';

export function getBasePath(): string {
  const path = window.location.pathname;
  if (path.startsWith(APP_SUB_PATH)) {
    return APP_SUB_PATH;
  }
  return '';
}

export function getBaseHref(): string {
  const basePath = getBasePath();
  return basePath ? `${basePath}/` : '/';
}
