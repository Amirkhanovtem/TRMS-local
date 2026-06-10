import { Component, Input } from '@angular/core';
import { Cit } from './core/cit-core.mjs';
import { optHash, rand } from './util';
import * as i0 from '@angular/core';
export class CitMonthComponent {
  constructor() {
    this.events = [];
    this._requestUpdate = false;
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
    this.control = new Cit.Month(this.id);
    this.updateOptions();
    this.updateEvents();
    this._requestUpdate = false; // config just loaded and calling init(), no need to call update again
    this.control.init();
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
    let hash = optHash(this.config);
    if (hash !== this._hashOptions) {
      let dp = this.control;
      dp.internal.loadOptions(this.config);
      this._requestUpdate = true;
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
CitMonthComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitMonthComponent,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
CitMonthComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitMonthComponent,
  selector: 'cit-month',
  inputs: { events: 'events', config: 'config' },
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
  type: CitMonthComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-month',
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
  },
});
