import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cit } from './core/cit-core.mjs';
import { optHash, rand, EventDiff } from './util';
import * as i0 from '@angular/core';
export class CitSchedulerComponent {
  constructor() {
    this.viewChange = new EventEmitter();
    this._requestUpdateFull = false;
    this._requestUpdateEvents = false;
    this._requestViewChange = false;
    this._eventDiff = new EventDiff();
    this._visibleRange = { start: new Cit.Date(), end: new Cit.Date() };
    this._hashOptions = '';
    this._eventsSet = false;
    this._events = [];
    this._id = 'dp_' + new Date().getTime() + rand();
  }
  //@Input() events: Cit.EventData[];
  get events() {
    return this._events;
  }
  set events(value) {
    this._eventsSet = true;
    this._events = value;
  }
  get id() {
    return this._id;
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.dispose();
  }
  ngAfterViewInit() {
    // not sure why this was called here, it shouldn't be
    // this.dispose();
    this.control = new Cit.Scheduler(this.id);
    let control = this.control;
    control.internal.enableAngular2();
    this.updateOptions();
    this.updateEvents();
    this._requestUpdateFull = false; // config just loaded and calling init(), no need to call update again
    this._requestUpdateEvents = false; // config just loaded and calling init(), no need to call update again
    this.control.init();
  }
  ngDoCheck() {
    if (!this.control) {
      return;
    }
    this.updateOptions();
    this.updateEvents();
    let control = this.control;
    if (this._requestUpdateFull) {
      this.control.update();
      control.internal.postInit();
      this._requestUpdateFull = false;
      this._requestUpdateEvents = false;
    } else if (this._requestUpdateEvents) {
      this.control.update({ 'events': this.events });
      this._requestUpdateEvents = false;
    }
    if (this._requestViewChange) {
      this._requestViewChange = false;
      let args = {};
      args.visibleRangeChanged =
        this._visibleRange.start !== this.control.visibleStart() ||
        this._visibleRange.end !== this.control.visibleEnd();
      this._visibleRange.start = this.control.visibleStart();
      this._visibleRange.end = this.control.visibleEnd();
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
      let control = this.control;
      if (this.config && this.config.resources) {
        control.internal.resourcesFromAttr();
      }
      if (control.internal.skipUpdate()) {
        control.internal.skipped();
      } else {
        control.internal.loadOptions(this.config);
        this._requestUpdateFull = true;
        this._requestViewChange = true;
      }
    }
    this._hashOptions = hash;
  }
  updateEvents() {
    if (!this._eventsSet) {
      return;
    }
    let diff = this._eventDiff.diff(this.events);
    let control = this.control;
    control.internal.eventsFromAttr();
    if (control.internal.skipUpdate()) {
      control.internal.skipped();
      //this._hashEvents = hash;
      return;
    }
    let maxInlineChanges = 10;
    if (diff.changeCount === 0 && this.events === control.events.list) {
      return;
    }
    if (diff.changeCount < maxInlineChanges && this.events === control.events.list) {
      diff.add.forEach(function (data) {
        control.events.add(new Cit.Event(data), null, { 'renderOnly': true });
      });
      diff.modify.forEach(function (data) {
        control.events.update(new Cit.Event(data));
      });
      diff.remove.forEach(function (id) {
        let e = control.events.find(id);
        if (e) {
          control.events.remove(e);
        }
      });
      control.internal.evImmediateRefresh();
      // make sure it's synced, after inline update
      //control.events.list = this.events;
    } else {
      control.events.list = this.events;
      this._requestUpdateEvents = true;
    }
  }
}
CitSchedulerComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitSchedulerComponent,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
CitSchedulerComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitSchedulerComponent,
  selector: 'cit-scheduler',
  inputs: { config: 'config', events: 'events' },
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
  type: CitSchedulerComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-scheduler',
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
    config: [
      {
        type: Input,
      },
    ],
    events: [
      {
        type: Input,
      },
    ],
  },
});
