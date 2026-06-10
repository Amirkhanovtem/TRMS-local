import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowNumbersOnlyDirective]',
  standalone: false,
})
export class AllowNumbersOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/\D*/g, '');

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
