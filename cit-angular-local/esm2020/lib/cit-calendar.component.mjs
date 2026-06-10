import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cit } from './core/cit-core.mjs';
import { optHash, rand } from './util';
import * as i0 from '@angular/core';
export class CitCalendarComponent {
  constructor() {
    this.viewChange = new EventEmitter();
    this.events = [];
    this._requestUpdateFull = false;
    this._requestUpdateEvents = false;
    this._requestViewChange = false;
    this._hashOptions = '';
    this._hashEvents = '';
    this._id = 'dp_' + new Date().getTime() + rand();
  }
  get id() {
    return this._id;
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.dispose();
  }
  ngAfterViewInit() {
    this.dispose();
    let dp = new Cit.Calendar(this.id);
    this.control = dp;
    this.updateOptions();
    this.updateEvents();
    this._requestUpdateFull = false; // config just loaded and calling init(), no need to call update again
    this._requestUpdateEvents = false; // config just loaded and calling init(), no need to call update again
    dp.init();
  }
  ngDoCheck() {
    if (!this.control) {
      return;
    }
    this.updateOptions();
    this.updateEvents();
    if (this._requestUpdateFull) {
      this.control.update();
      this._requestUpdateFull = false;
      this._requestUpdateEvents = false;
    } else if (this._requestUpdateEvents) {
      this.control.update({ 'events': this.events });
      this._requestUpdateEvents = false;
    }
    if (this._requestViewChange) {
      this._requestViewChange = false;
      let args = {};
      this.viewChange.emit(args);
    }
  }
  dispose() {
    if (this.control) {
      this.control.dispose();
      //@ts-ignore
      this.control = null;
    }
  }
  updateOptions() {
    let hash = optHash(this.config);
    if (hash !== this._hashOptions) {
      let dp = this.control;
      dp.internal.loadOptions(this.config);
      this._requestUpdateFull = true;
      this._requestViewChange = true;
    }
    this._hashOptions = hash;
  }
  updateEvents() {
    let hash = optHash(this.events);
    if (hash !== this._hashEvents) {
      let dp = this.control;
      if (dp) {
        dp.events.list = this.events;
      }
      this._requestUpdateEvents = true;
    }
    this._hashEvents = hash;
  }
}
CitCalendarComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitCalendarComponent,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
CitCalendarComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitCalendarComponent,
  selector: 'cit-calendar',
  inputs: { events: 'events', config: 'config' },
  outputs: { viewChange: 'viewChange' },
  ngImport: i0,
  template: `
    <div id='{{id}}'></div>`,
  isInline: true,
  styles: [''],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitCalendarComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-calendar',
          template: `
    <div id='{{id}}'></div>`,
          styles: [``],
        },
      ],
    },
  ],
  propDecorators: {
    viewChange: [
      {
        type: Output,
      },
    ],
    events: [
      {
        type: Input,
      },
    ],
    config: [
      {
        type: Input,
      },
    ],
  },
});
