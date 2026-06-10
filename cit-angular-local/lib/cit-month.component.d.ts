import { AfterViewInit, DoCheck, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitMonthComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  control: Cit.Month;
  events: Array<Cit.EventData>;
  config: any;
  private _requestUpdate;
  private _hashOptions;
  private _hashEvents;
  private _id;
  get id(): string;
  ngOnInit(): void;
  ngOnDestroy(): void;
  ngAfterViewInit(): void;
  ngDoCheck(): void;
  private dispose;
  private updateOptions;
  private updateEvents;
  static ɵfac: i0.ɵɵFactoryDeclaration<CitMonthComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitMonthComponent,
    'cit-month',
    never,
    { 'events': 'events'; 'config': 'config' },
    {},
    never,
    never
  >;
}
