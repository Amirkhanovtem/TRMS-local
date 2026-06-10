import { KeyValue } from '@angular/common';
import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { Localization } from '@localization/localization';
import { PersonSelectionModalComponent } from '@person-modals-selection/person-selection-modal.component';
import { PersonModel } from '@person-models/person.model';

@Component({
  selector: 'app-select-persons-by-personal-number-modal',
  templateUrl: './select-persons-by-personal-number-modal.component.html',
  styleUrls: ['./select-persons-by-personal-number-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class SelectPersonsByPersonalNumberModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public splitter: string = '\\n';
  public inputText: string = '';
  public personalNumberPersonMap: Map<string, PersonModel> = new Map<string, PersonModel>();

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      personSelectionModalComponent: PersonSelectionModalComponent;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  collectPersonsByPersonalNumber() {
    const splitter: string = this.splitter && this.splitter === '\\n' ? '\n' : this.splitter,
      data = this.dialogParams.personSelectionModalComponent.table.getData(),
      selectedPersonalNumbersList: Array<string> = splitter ? this.inputText?.trim().split(splitter) : [this.inputText];

    selectedPersonalNumbersList.forEach(personalNumber => {
      const personByPersonalNumber: PersonModel = data.find(person => person.personalNumber === personalNumber);

      this.personalNumberPersonMap.set(personalNumber, personByPersonalNumber);
    });

    this.inputText = '';
  }

  getChipLabel(personalNumberPerson: KeyValue<string, PersonModel>): string {
    let personalNumber: string = personalNumberPerson.key,
      person: PersonModel = personalNumberPerson.value,
      personName: string = '';

    if (person) {
      const personNameByLoc: string =
        this.localization.getLanguageFromStorage() === Localization.LANG_RU ? person.fullNameRu : person.fullNameEn;

      personName = `(${personNameByLoc})`;
    }

    return personalNumber + personName;
  }

  removeSelectedPersonalNumber(personalNumber: string): void {
    this.personalNumberPersonMap.delete(personalNumber);
  }

  confirmSelectedPersonalNumber(): void {
    const personSelectionModalComponent: PersonSelectionModalComponent =
        this.dialogParams.personSelectionModalComponent,
      correctPersonalNumberList: Array<string> = [];

    this.personalNumberPersonMap.forEach((value, key) => {
      if (value) {
        correctPersonalNumberList.push(key);
        personSelectionModalComponent.table.selection.select(value);
      }
    });

    personSelectionModalComponent.table.displayedColumns.forEach(col => {
      if (col.colDef === 'personalNumber') {
        col.selectedByColFilterValues = correctPersonalNumberList;
      } else {
        col.selectedByColFilterValues = null;
      }
    });

    personSelectionModalComponent.table.applySearch();

    this.modalComponent.modal.close(true);
  }
}
