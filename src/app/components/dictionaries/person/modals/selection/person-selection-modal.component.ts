import { Component, ElementRef, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TableWrapperColumnHeaderDirective } from '@common-table-table-wrapper-directives/table-wrapper-column-header.directive';
import { SelectPersonsByPersonalNumberModalComponent } from '@person-modals-select-persons-by-personal-number/select-persons-by-personal-number-modal.component';
import { PersonModel } from '@person-models/person.model';
import { PersonStatusEnum } from '@person-models/person-status.enum';

@Component({
  selector: 'app-person-selection-modal',
  templateUrl: './person-selection-modal.component.html',
  styleUrls: ['./person-selection-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class PersonSelectionModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @ViewChildren(TableWrapperColumnHeaderDirective)
  tableColHeaderTemplateList: QueryList<TableWrapperColumnHeaderDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'fullNameRu',
      colTitleLocKey: 'personFullNameRuColTable',
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
    },
    {
      colDef: 'lastName',
      colTitleLocKey: 'personLastNameColTable',
    },
    {
      colDef: 'firstName',
      colTitleLocKey: 'personFirstNameColTable',
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
    },
    {
      colDef: 'email',
      colTitleLocKey: 'personEmailColTable',
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'personEmploymentDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'terminationDate',
      colTitleLocKey: 'personTerminationDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['subdivision', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'position',
      colTitleLocKey: 'personPositionColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'personCostCenterColTable',
      modelPropertyPath: ['costCenter', 'name'],
    },
    {
      colDef: 'city',
      colTitleLocKey: 'personCityColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'company',
      colTitleLocKey: 'personCompanyColTable',
      modelPropertyPath: ['company', 'name'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedPersons: Array<PersonModel>;
    },
  ) {
    super(injector);
  }

  @ViewChild('selectByPositionMatSelect') selectByPositionMatSelect: ElementRef;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setSelectedRowByPrevModal();
  }

  setSelectedRowByPrevModal(): void {
    const prevRows = this.dialogParams?.selectedPersons ?? [];

    this.table.selection.setSelection(...prevRows);
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }

  saveModal(selectedPersons: Array<PersonModel>): void {
    this.modalComponent.modal.close({
      save: true,
      selectedPersons: selectedPersons,
    });
  }

  checkSelectedPersons(): void {
    const selectedPersons: Array<PersonModel> = this.table?.selection.selected;

    const personsWithWarningStatus = selectedPersons.some(person => {
      const status = person.status.id;

      return status === PersonStatusEnum.TERMINATED || status === PersonStatusEnum.SUSPENDED;
    });

    if (personsWithWarningStatus) {
      this.openConfirmWarningStatusModal(selectedPersons);
    } else {
      this.saveModal(selectedPersons);
    }
  }

  private openConfirmWarningStatusModal(selectedPersons: Array<PersonModel>): void {
    const message = this.localization.getLocalTextFromKey('trainerPersonSelectionModalConfirmModalByStatusMessage'),
      matDialogRef = this.showConfirmModal(message);

    matDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveModal(selectedPersons);
      }
    });
  }

  getUniquePositionsList(): Array<string> {
    const uniquePositionsList: Set<string> = new Set<string>();

    this.table?.getData().forEach(person => {
      uniquePositionsList.add(person.position?.[this.localEnumField]);
    });

    return [...uniquePositionsList];
  }

  openPositionList($event): void {
    this.selectByPositionMatSelect['open']();
    $event.stopPropagation();
  }

  selectUnselectByPosition($event, positionName: string): void {
    const isSelected = $event.source._selected;

    const selectPerson = this.table?.getData().filter(person => {
      return person?.position?.[this.localEnumField] === positionName;
    });

    if (isSelected) {
      this.table?.selection.select(...selectPerson);
    } else {
      this.table?.selection.deselect(...selectPerson);
    }
  }

  openSelectPersonsByPersonalNumber(): void {
    this.newModal.open(SelectPersonsByPersonalNumberModalComponent, {
      data: {
        personSelectionModalComponent: this,
      },
    });
  }
}
