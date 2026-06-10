import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowOnlyNumberStepHalfPointDirective]',
  standalone: false,
})
export class AllowOnlyNumberStepHalfPointDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^.\d]+|[.,]+[^05]$|((?<=[.,]\d).+)/g, '');

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
