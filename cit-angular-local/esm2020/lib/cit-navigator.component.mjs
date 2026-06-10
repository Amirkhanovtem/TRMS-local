import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cit } from './core/cit-core.mjs';
import { optHash, rand } from './util';
import * as i0 from '@angular/core';
export class CitNavigatorComponent {
  constructor() {
    this.events = [];
    this.dateChange = new EventEmitter();
    this._requestUpdate = false;
    this._hashOptions = '';
    this._hashEvents = '';
    this._onTrs = null;
    this._dateSet = false;
    this._currentDate = null;
    this._date = Cit.Date.today();
    this._id = 'dp_' + new Date().getTime() + rand();
  }
  get date() {
    return this._date;
  }
  // @Input() date: Cit.Date = Cit.Date.today();
  set date(value) {
    this._date = value;
    this._dateSet = true;
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
    this.control = new Cit.Navigator(this.id);
    let component = this;
    this.updateOptions();
    this.updateEvents();
    let dp = this.control;
    this.control.onTimeRangeSelected = function (args) {
      // emit event
      component.dateChange.emit(args.day);
      // call the original
      if (component._onTrs) {
        component._onTrs.call(dp, args);
      }
    };
    this._requestUpdate = false; // config just loaded and calling init(), no need to call update again
    this.control.init();
    if (this.control.selectionDay !== Cit.Date.today()) {
      component.dateChange.emit(this.control.selectionDay);
    }
  }
  ngDoCheck() {
    if (!this.control) {
      return;
    }
    this.updateOptions();
    this.updateEvents();
    if (this._requestUpdate) {
      this.control.update();
      this._requestUpdate = false;
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
    let dp = this.control;
    let hash = optHash(this.config);
    if (hash !== this._hashOptions) {
      for (let name in this.config) {
        if (name === 'selectionDay') {
          continue; // ignore
        }
        if (name === 'onTimeRangeSelected') {
          this._onTrs = this.config.onTimeRangeSelected;
        } else {
          dp[name] = this.config[name];
        }
        this._requestUpdate = true;
      }
    }
    if (this._dateSet && this.date) {
      this._dateSet = false;
      this._currentDate = dp.selectionDay;
      dp.select(this.date);
    }
    this._hashOptions = hash;
  }
  updateEvents() {
    let hash = optHash(this.events);
    if (hash !== this._hashEvents) {
      let dp = this.control;
      dp.events.list = this.events;
      this._requestUpdate = true;
    }
    this._hashEvents = hash;
  }
}
CitNavigatorComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitNavigatorComponent,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
CitNavigatorComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitNavigatorComponent,
  selector: 'cit-navigator',
  inputs: { events: 'events', config: 'config', date: 'date' },
  outputs: { dateChange: 'dateChange' },
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
  type: CitNavigatorComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-navigator',
          template: `
    <div id='{{id}}'></div>`,
          styles: [``],
        },
      ],
    },
  ],
  propDecorators: {
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
    dateChange: [
      {
        type: Output,
      },
    ],
    date: [
      {
        type: Input,
      },
    ],
  },
});
