import { AfterViewInit, DoCheck, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitCalendarComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  control: Cit.Calendar;
  viewChange: EventEmitter<Cit.Date>;
  events: Array<Cit.EventData>;
  config: any;
  private _requestUpdateFull;
  private _requestUpdateEvents;
  private _requestViewChange;
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
  static ɵfac: i0.ɵɵFactoryDeclaration<CitCalendarComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitCalendarComponent,
    'cit-calendar',
    never,
    { 'events': 'events'; 'config': 'config' },
    { 'viewChange': 'viewChange' },
    never,
    never
  >;
}
