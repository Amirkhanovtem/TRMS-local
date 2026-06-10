import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import * as i0 from '@angular/core';
/**
@deprecated This component will be removed in the future. Use Cit.Modal instead.
 */
export declare class CitModalComponent implements OnInit {
  private element;
  autoFocus: boolean;
  close: EventEmitter<any>;
  private _visibility;
  constructor(element: ElementRef);
  get visible(): boolean;
  ngOnInit(): void;
  show(): void;
  hide(result?: any): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<CitModalComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitModalComponent,
    'cit-modal',
    never,
    { 'autoFocus': 'autoFocus' },
    { 'close': 'close' },
    never,
    ['*']
  >;
}
