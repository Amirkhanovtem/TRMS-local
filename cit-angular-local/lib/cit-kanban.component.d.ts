import { AfterViewInit, DoCheck, OnDestroy, OnInit } from '@angular/core';
import * as i0 from '@angular/core';

import { Cit } from './core/cit-core';
export declare class CitKanbanComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  control: Cit.Kanban;
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
  static ɵfac: i0.ɵɵFactoryDeclaration<CitKanbanComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    CitKanbanComponent,
    'cit-kanban',
    never,
    { 'config': 'config' },
    {},
    never,
    never
  >;
}
