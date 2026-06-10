import { Component, Input } from '@angular/core';
import { optHash, rand } from './util';
import { Cit } from './core/cit-core.mjs';
import * as i0 from '@angular/core';
export class CitQueueComponent {
  constructor() {
    this._requestUpdate = false;
    this._hashOptions = '';
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
    this.control = new Cit.Queue(this.id);
    this.updateOptions();
    this._requestUpdate = false; // config just loaded and calling init(), no need to call update again
    this.control.init();
  }
  ngDoCheck() {
    if (!this.control) {
      return;
    }
    this.updateOptions();
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
}
CitQueueComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitQueueComponent,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
CitQueueComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '12.0.0',
  version: '13.1.3',
  type: CitQueueComponent,
  selector: 'cit-queue',
  inputs: { config: 'config' },
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
  type: CitQueueComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'cit-queue',
          template: `
    <div id='{{id}}'></div>`,
          styles: [``],
        },
      ],
    },
  ],
  propDecorators: {
    config: [
      {
        type: Input,
      },
    ],
  },
});
