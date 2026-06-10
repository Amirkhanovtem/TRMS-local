import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pad',
  standalone: false,
})
export class PadPipe implements PipeTransform {
  transform(value: number | string | null | undefined, length = 2, char = '0'): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (value.toString().length === 2) {
      return value.toString();
    }

    return value.toString().padStart(length, char);
  }
}
