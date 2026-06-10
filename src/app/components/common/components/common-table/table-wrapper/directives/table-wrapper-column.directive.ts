import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tableWrapperColumn]',
  standalone: false,
})
export class TableWrapperColumnDirective {
  @Input() tableWrapperColumn: string;

  constructor(public template: TemplateRef<any>) {}
}
