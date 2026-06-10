import { PipeTransform } from '@angular/core';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';

export interface DisplayedColumnInterface {
  colDef: string;
  colTitleLocKey?: string;
  modelPropertyPath?: Array<any>;
  colType?: DisplayedColumnTypeEnum;
  hidden?: boolean;
  colVisualValuePipe?: PipeTransform;
  colGetValueFunc?: (data: any) => any;
  colGetFilterValueFunc?: (data: any) => any;
  selectedByColFilterValues?: Array<string>;
  offFilter?: boolean;
  filterOrder?: number;
  width?: number;
}
