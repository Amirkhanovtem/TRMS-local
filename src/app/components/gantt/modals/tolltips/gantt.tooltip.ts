import { Directive, Injector } from '@angular/core';
import { Localization } from '@localization/localization';
import { Cit } from 'cit-angular';

@Directive()
export abstract class GanttTooltip {
  source: any = null;
  scheduler: Cit.Scheduler = null;

  localization: Localization = null;
  localEnumField: string = null;

  constructor(injector: Injector) {
    this.localization = injector.get(Localization);
    this.localEnumField = this.localization.getLocalFieldEnumName();
  }

  protected backColor(): string {
    return 'white';
  }

  protected colorizeTooltip() {
    const mainInnerElement = document.getElementsByClassName('trms_gantt_tooltip_main_inner'),
      arrowTopElement = document.getElementsByClassName('trms_gantt_tooltip_arrow_top'),
      arrowBottomElement = document.getElementsByClassName('trms_gantt_tooltip_arrow_bottom'),
      arrowLeftElement = document.getElementsByClassName('trms_gantt_tooltip_arrow_left'),
      arrowRightElement = document.getElementsByClassName('trms_gantt_tooltip_arrow_right');

    this.updateBackColor(mainInnerElement);
    this.updateBackColor(arrowTopElement, true);
    this.updateBackColor(arrowBottomElement, true);
    this.updateBackColor(arrowLeftElement, true);
    this.updateBackColor(arrowRightElement, true);
  }

  protected updateBackColor(elements: any, isArrow?: boolean) {
    if (elements) {
      for (const element of elements) {
        if (isArrow) {
          element.style.fill = this.backColor();
          element.style.stroke = this.backColor();
        } else {
          element.style.background = this.backColor();
        }
      }
    }
  }
}
