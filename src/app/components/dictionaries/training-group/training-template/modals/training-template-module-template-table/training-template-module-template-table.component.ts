import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateModuleTemplateComponent } from '@module-template-modals-create-update/create-update-module-template.component';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

@Component({
  selector: 'app-training-template-module-template-table',
  templateUrl: './training-template-module-template-table.component.html',
  styleUrls: ['./training-template-module-template-table.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingTemplateModuleTemplateTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() trainingTemplate: TrainingTemplateModel = new TrainingTemplateModel();
  @Input() isView: boolean = false;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'moduleTemplateNameColTable',
    },
  ];

  constructor(
    private injector: Injector,
    private dragOrderService: DragOrderService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateModuleTemplateDataSource();
  }

  openCreateModuleTemplateModal(): void {
    const modalRef = this.newModal.open(CreateUpdateModuleTemplateComponent, {
      data: {
        format: this.trainingTemplate.format,
      },
    });

    this.closeModalHandler(modalRef);
  }

  openEditModuleTemplateModal(moduleTemplate: ModuleTemplateModel): void {
    const modalRef = this.newModal.open(CreateUpdateModuleTemplateComponent, {
      data: {
        model: moduleTemplate,
        isUpdate: true,
        isModuleUpdated: moduleTemplate.isUpdated,
      },
    });

    this.closeModalHandler(modalRef);
  }

  openViewModuleTemplateModal(moduleTemplate: ModuleTemplateModel): void {
    this.newModal.open(CreateUpdateModuleTemplateComponent, {
      data: {
        model: moduleTemplate,
        isView: true,
      },
    });
  }

  closeModalHandler(modalRef: MatDialogRef<CreateUpdateModuleTemplateComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        this.changeModuleTemplateHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changeModuleTemplateHandler(createUpdateModuleTemplateModal): void {
    if (createUpdateModuleTemplateModal?.save) {
      this.trainingTemplate.trainingModuleTemplates.push(createUpdateModuleTemplateModal.moduleTemplate);
    }

    this.trainingTemplate.trainingModuleTemplates = this.dragOrderService.processSettingOrder(
      this.trainingTemplate.trainingModuleTemplates,
    );

    this.updateModuleTemplateDataSource();
  }

  updateModuleTemplateDataSource(): void {
    this.table.commonLoadTableHandler(this.getTableDataSource());
  }

  removeModuleTemplateFromList(targetModuleTemplate: ModuleTemplateModel): void {
    if (!targetModuleTemplate.isCreated) {
      TrainingTemplateModuleTemplateTableComponent.setDeletedStatus(targetModuleTemplate);
    } else {
      this.trainingTemplate.trainingModuleTemplates = this.trainingTemplate.trainingModuleTemplates.filter(
        moduleTemplate => moduleTemplate !== targetModuleTemplate,
      );
    }

    this.trainingTemplate.trainingModuleTemplates = this.dragOrderService.processSettingOrder(
      this.trainingTemplate.trainingModuleTemplates,
    );

    this.updateModuleTemplateDataSource();
  }

  private static setDeletedStatus(targetModuleTemplate: ModuleTemplateModel): void {
    targetModuleTemplate.isDeleted = true;
    targetModuleTemplate.isUpdated = false;
    targetModuleTemplate.dontOrder = true;
    targetModuleTemplate.orderNumber = null;
  }

  private getTableDataSource(): Array<ModuleTemplateModel> {
    return this.trainingTemplate.trainingModuleTemplates.filter(
      trainingModuleTemplate => !trainingModuleTemplate.isDeleted,
    );
  }
}
