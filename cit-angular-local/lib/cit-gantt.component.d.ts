import { AfterViewInit, DoCheck, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitGanttComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  control: Cit.Gantt;
  config: any;
  private _requestUpdate;
  private _hashOptions;
  private _id;
  get id(): string;
  ngOnInit(): void;
  ngOnDestroy(): void;
  ngAfterViewInit(): void;
  ngDoCheck(): void;
  private dispose;
  private updateOptions;
  static ɵfac: i0.ɵɵFactoryDeclaration<CitGanttComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitGanttComponent,
    'cit-gantt',
    never,
    { 'config': 'config' },
    {},
    never,
    never
  >;
}
