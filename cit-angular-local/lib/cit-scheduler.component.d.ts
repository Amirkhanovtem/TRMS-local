import { AfterViewInit, DoCheck, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitSchedulerComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  control: Cit.Scheduler;
  viewChange: EventEmitter<Cit.Date>;
  config: any;
  private _requestUpdateFull;
  private _requestUpdateEvents;
  private _requestViewChange;
  private _eventDiff;
  private _visibleRange;
  private _hashOptions;
  private _eventsSet;
  private _events;
  get events(): Array<Cit.EventData>;
  set events(value: Array<Cit.EventData>);
  private _id;
  get id(): string;
  ngOnInit(): void;
  ngOnDestroy(): void;
  ngAfterViewInit(): void;
  ngDoCheck(): void;
  private dispose;
  private updateOptions;
  private updateEvents;
  static ɵfac: i0.ɵɵFactoryDeclaration<CitSchedulerComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitSchedulerComponent,
    'cit-scheduler',
    never,
    { 'config': 'config'; 'events': 'events' },
    { 'viewChange': 'viewChange' },
    never,
    never
  >;
}
