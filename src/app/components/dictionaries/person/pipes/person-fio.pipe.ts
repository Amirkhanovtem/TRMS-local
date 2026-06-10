import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personFioPipe',
  standalone: false,
})
export class PersonFioPipe implements PipeTransform {
  transform(person: any): string {
    const firstName = person.firstName ? person.firstName.charAt(0) + '.' : '',
      patronymic = person.patronymic ? person.patronymic.charAt(0) + '.' : '';

    return `${person.lastName} ${firstName} ${patronymic}`;
  }
}
