import { Injectable } from '@angular/core';
import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';

@Injectable({
  providedIn: 'root',
})
export class DragOrderService {
  processSettingOrder(targetList: Array<DragOrderModel>, sourceList?: Array<DragOrderModel>): any {
    if (sourceList && sourceList.length > 0) {
      this.setOrderToTargetFromSource(targetList, sourceList);
    }

    const sortedTargetList: Array<DragOrderModel> = this.sortByOrder(targetList);
    this.setOrderBySorting(sortedTargetList);

    return sortedTargetList;
  }

  public setOrderToTargetFromSource(targetList: Array<DragOrderModel>, sourceList: Array<DragOrderModel>) {
    targetList.forEach(target => {
      const source = sourceList.find(source => {
        return source?.id === target.id;
      });

      target.orderNumber = source?.orderNumber === undefined ? null : source?.orderNumber;
    });
  }

  public sortByOrder(targetList: Array<DragOrderModel>): Array<DragOrderModel> {
    const nullOrderList: Array<DragOrderModel> = targetList
      .filter(target => target.orderNumber === null)
      .sort((target1, target2) => {
        return Number(target1.dontOrder) - Number(target2.dontOrder);
      });

    return targetList
      .filter(target => target.orderNumber !== null)
      .sort((target1, target2) => {
        return target1.orderNumber - target2.orderNumber;
      })
      .concat(nullOrderList);
  }

  public setOrderBySorting(targetList: Array<DragOrderModel>) {
    targetList.forEach((target, i) => {
      if (!target.dontOrder) target.orderNumber = i;
    });
  }
}
