import { Component, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import * as i0 from '@angular/core';
/**
@deprecated This component will be removed in the future. Use Cit.Modal instead.
 */
export class CitModalComponent {
  constructor(element) {
    this.element = element;
    this.autoFocus = true;
    this.close = new EventEmitter();
    this._visibility = 'hidden';
  }
  get visible() {
    return this._visibility === 'visible';
  }
  ngOnInit() {}
  show() {
    this._visibility = 'visible';
    let element = this.element.nativeElement;
    if (this.autoFocus) {
      setTimeout(() => {
        let first = element.querySelector('input');
        first && first.focus();
      });
    }
  }
  hide(result) {
    this._visibility = 'hidden';
    this.close.emit({ 'result': result });
  }
}
CitModalComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModalComponent,
  deps: [{ token: ElementRef }],
  target: i0.ɵɵFactoryTarget.Component,
});
CitModalComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitModalComponent,
  selector: 'cit-modal',
  inputs: { autoFocus: 'autoFocus' },
  outputs: { close: 'close' },
  ngImport: i0,
  template: `
    <div
      class="overlay"
      (click)="hide()"
      [class.visible]="visible"
    ></div>
    <div
      class="modal"
      [class.visible]="visible"
    >
      <ng-content></ng-content>
    </div>`,
  isInline: true,
  styles: [
    '.modal{position:fixed;top:0px;left:0px;right:0px;max-height:80%;overflow-y:auto;padding:20px;background-color:#fff;transform:translateY(-100%)}.modal.visible{transform:translateY(0)}.overlay{position:fixed;top:0px;left:0px;right:0px;bottom:0px;background-color:#000;opacity:0;margin-left:100%}.overlay.visible{margin-left:0;opacity:.3}.modal{transition:transform .3s cubic-bezier(0,0,.3,1)}.overlay{transition:margin-left 0s linear .3s,opacity .3s}.overlay.visible{transition:margin-left 0s,opacity .3s}\n',
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModalComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-modal',
          styles: [
            `
    .modal {
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      max-height: 80%;
      overflow-y: auto;
      padding: 20px;
      background-color: white;

      transform: translateY(-100%);
    }

    .modal.visible {
      transform: translateY(0);
    }

    .overlay {
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background-color: #000;

      opacity: 0;
      margin-left: 100%;
    }

    .overlay.visible {
      margin-left: 0;
      opacity: 0.3;
    }

    .modal {
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
    }

    .overlay {
      transition: margin-left 0s linear 0.3s, opacity 0.3s;
    }

    .overlay.visible {
      transition: margin-left 0s, opacity 0.3s;
    }
  `,
          ],
          template: `
    <div
      class="overlay"
      (click)="hide()"
      [class.visible]="visible"
    ></div>
    <div
      class="modal"
      [class.visible]="visible"
    >
      <ng-content></ng-content>
    </div>`,
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      {
        type: i0.ElementRef,
        decorators: [
          {
            type: Inject,
            args: [ElementRef],
          },
        ],
      },
    ];
  },
  propDecorators: {
    autoFocus: [
      {
        type: Input,
      },
    ],
    close: [
      {
        type: Output,
      },
    ],
  },
});
