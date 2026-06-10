import { Component, EventEmitter, Injector, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateModuleModalComponent } from '@event-module-modals-create-update/create-update-module-modal.component';
import { ModuleModel } from '@event-module-models/module.model';
import { TrainingModel } from '@event-training-models/training.model';

@Component({
  selector: 'app-training-module-table',
  templateUrl: './training-module-table.component.html',
  styleUrls: ['./training-module-table.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingModuleTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() training: TrainingModel = new TrainingModel();
  @Input() isView: boolean = false;
  @Input() allModulesInEvent: Array<ModuleModel> = [];
  @Output() updateChildComponentsTable? = new EventEmitter();

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'trainingModuleTableNameColTable',
    },
  ];

  constructor(
    private modal: MatDialog,
    private injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateTrainingModuleDataSource();
  }

  updateTrainingModuleDataSource() {
    this.table.commonLoadTableHandler(this.getSortedModulesByStartDate());
  }

  getSortedModulesByStartDate(): Array<ModuleModel> {
    return this.training.trainingModules.sort((m1, m2) => {
      return new Date(m1.startDate).getTime() - new Date(m2.startDate).getTime();
    });
  }

  checkModule(module: ModuleModel): boolean {
    return Object.assign(new ModuleModel(), module).checkModule();
  }

  openCreateUpdateOrViewModuleModal(module: ModuleModel): void {
    if (this.isView) {
      this.openViewModule(module);
    } else {
      this.openCreateUpdateModule(module);
    }
  }

  openViewModule(module: ModuleModel): void {
    this.modal.open(CreateUpdateModuleModalComponent, {
      data: {
        model: module,
        allModulesInEvent: this.allModulesInEvent,
        trainingTemplateId: this.training.trainingTemplate.id,
        isView: true,
      },
    });
  }

  openCreateUpdateModule(module: ModuleModel): void {
    const modalRef = this.modal.open(CreateUpdateModuleModalComponent, {
      data: {
        model: module,
        allModulesInEvent: this.allModulesInEvent,
        trainingTemplateId: this.training.trainingTemplate.id,
      },
    });

    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<CreateUpdateModuleModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        this.updateChildComponentsTable.emit();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
