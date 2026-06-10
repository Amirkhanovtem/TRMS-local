import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tableWrapperColumnHeader]',
  standalone: false,
})
export class TableWrapperColumnHeaderDirective {
  @Input() tableWrapperColumnHeader: string;

  constructor(public template: TemplateRef<any>) {}
}
