import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';

@Component({
  selector: 'app-drag-order-modal',
  templateUrl: './drag-order-modal.component.html',
  styleUrls: ['./drag-order-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class DragOrderModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  orderedObjectsList: Array<DragOrderModel> = structuredClone(this.dialogParams.dragModelList);

  constructor(
    injector: Injector,
    private dragOrderService: DragOrderService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      title: string;
      dragModelList: Array<DragOrderModel>;
    },
  ) {
    super(injector);
  }

  drop(event: CdkDragDrop<Array<DragOrderModel>>): void {
    moveItemInArray(this.orderedObjectsList, event.previousIndex, event.currentIndex);
    this.dragOrderService.setOrderBySorting(this.orderedObjectsList);
  }

  save(): void {
    this.modalComponent.modal.close({
      newOrderedObjectList: this.orderedObjectsList,
    });
  }
}
