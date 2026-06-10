import { v4 as uuidv4 } from 'uuid';

const UUID_REGEX: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export function isUUID(uuid: string): boolean {
  return UUID_REGEX.test(uuid);
}

export function getNewUuid(): string {
  return uuidv4();
}
