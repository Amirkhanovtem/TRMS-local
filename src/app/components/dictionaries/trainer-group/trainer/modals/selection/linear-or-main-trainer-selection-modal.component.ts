import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { PersonStatusEnum } from '@person-models/person-status.enum';
import { PersonService } from '@person-services/person.service';
import { TrainerModel } from '@trainer-models/trainer.model';
import { TrainerService } from '@trainer-services/trainer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-linear-or-main-trainer-selection-modal',
  templateUrl: './linear-or-main-trainer-selection-modal.component.html',
  styleUrls: ['./linear-or-main-trainer-selection-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class LinearOrMainTrainerSelectionModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
      modelPropertyPath: ['person', 'fullNameEn'],
    },
    {
      colDef: 'fullNameRu',
      colTitleLocKey: 'personFullNameRuColTable',
      modelPropertyPath: ['person', 'fullNameRu'],
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'creatingEventLinearTrainerTablePersonalNumberCol',
      modelPropertyPath: ['person', 'personalNumber'],
    },
    {
      colDef: 'email',
      colTitleLocKey: 'creatingEventLinearTrainerTableEmailCol',
      modelPropertyPath: ['person', 'email'],
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'creatingEventLinearTrainerTableEmploymentDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'employmentDate'],
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'creatingEventLinearTrainerTableSubdivisionCol',
      modelPropertyPath: ['person', 'subdivision', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'position',
      colTitleLocKey: 'creatingEventLinearTrainerTablePositionCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'position', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'creatingEventLinearTrainerTableCostCenterCol',
      modelPropertyPath: ['person', 'costCenter', 'name'],
    },
    {
      colDef: 'city',
      colTitleLocKey: 'creatingEventLinearTrainerTableCityCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'city', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'company',
      colTitleLocKey: 'creatingEventLinearTrainerTableCompanyCol',
      modelPropertyPath: ['person', 'company', 'name'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'creatingEventLinearTrainerTableStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'status', this.localization.getLocalFieldEnumName()],
    },
  ];

  constructor(
    private personService: PersonService,
    private trainerService: TrainerService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedTrainers: Array<TrainerModel>;
      trainingTemplateId: string;
      mainTrainer: boolean;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainers();
  }

  private loadTrainers(): void {
    this.table.loading = true;

    const trainingTemplateId = this.dialogParams?.trainingTemplateId,
      trainersObs: Observable<Array<TrainerModel>> = this.dialogParams.mainTrainer
        ? this.trainerService.getAllMainTrainersByTrainingTemplate(trainingTemplateId)
        : this.trainerService.getAllLinearTrainersByTrainingTemplate(trainingTemplateId);

    trainersObs.subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
        this.setSelectedRowByPrevModal();
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  setSelectedRowByPrevModal(): void {
    const currentRows = this.table.getData(),
      prevRows = this.dialogParams?.selectedTrainers,
      selectedRows: Array<TrainerModel> = [];

    for (const prevRow of prevRows) {
      const row = currentRows.filter(row => row.id === prevRow.id)[0];
      selectedRows.push(row);
    }

    this.table.selection.select(...selectedRows);
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }

  checkSelectedTrainers(): void {
    this.checkByResponsibility();
  }

  private checkByResponsibility(): void {
    const selectedTrainers: Array<TrainerModel> = this.table.selection.selected;

    const hasDataForConfirmByResponsible = selectedTrainers.some(trainer => {
      return !trainer.responsible;
    });

    if (hasDataForConfirmByResponsible) {
      this.openConfirmWarningResponsibleModal();
    } else {
      this.checkByPersonStatus();
    }
  }

  private checkByPersonStatus(): void {
    const selectedTrainers: Array<TrainerModel> = this.table.selection.selected;

    const hasDataForConfirmByStatus = selectedTrainers.some(trainer => {
      const status = trainer.person.status.id;

      return status === PersonStatusEnum.TERMINATED || status === PersonStatusEnum.SUSPENDED;
    });

    if (hasDataForConfirmByStatus) {
      this.openConfirmWarningStatusModal();
    } else {
      this.saveModal(selectedTrainers);
    }
  }

  private openConfirmWarningResponsibleModal(): void {
    const message = this.localization.getLocalTextFromKey('trainerSelectionModalConfirmModalByResponsibleMessage'),
      modalRef = this.showConfirmModal(message);

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.checkByPersonStatus();
      }
    });
  }

  private openConfirmWarningStatusModal(): void {
    const selectedTrainers: Array<TrainerModel> = this.table.selection.selected,
      message = this.localization.getLocalTextFromKey('trainerPersonSelectionModalConfirmModalByStatusMessage'),
      modalRef = this.showConfirmModal(message);

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveModal(selectedTrainers);
      }
    });
  }

  saveModal(selectedTrainers: Array<TrainerModel>): void {
    this.modalComponent.modal.close({
      save: true,
      selectedTrainers: selectedTrainers,
    });
  }

  isTrainerDisabled(trainer: TrainerModel): boolean {
    return false;
  }

  isTrainerDisabledStyle(trainer: TrainerModel): boolean {
    return !trainer.responsible;
  }

  selectRow(trainer: TrainerModel): void {
    if (!this.isTrainerDisabled(trainer)) {
      this.table.selection.toggle(trainer);
    }
  }
}
