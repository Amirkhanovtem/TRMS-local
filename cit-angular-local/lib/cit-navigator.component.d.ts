import { AfterViewInit, DoCheck, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitNavigatorComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  events: Array<Cit.EventDataShort>;
  config: any;
  dateChange: EventEmitter<Cit.Date>;
  control: Cit.Navigator;
  private _requestUpdate;
  private _hashOptions;
  private _hashEvents;
  private _onTrs;
  private _dateSet;
  private _currentDate;
  private _date;
  get date(): Cit.Date;
  set date(value: Cit.Date);
  private _id;
  get id(): string;
  ngOnInit(): void;
  ngOnDestroy(): void;
  ngAfterViewInit(): void;
  ngDoCheck(): void;
  private dispose;
  private updateOptions;
  private updateEvents;
  static ɵfac: i0.ɵɵFactoryDeclaration<CitNavigatorComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitNavigatorComponent,
    'cit-navigator',
    never,
    { 'events': 'events'; 'config': 'config'; 'date': 'date' },
    { 'dateChange': 'dateChange' },
    never,
    never
  >;
}
