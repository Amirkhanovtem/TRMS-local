import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ModuleModel } from '@event-module-models/module.model';
import { CreateUpdatePersonModalComponent } from '@person-modals-create-update/create-update-person-modal.component';
import { PersonSelectionModalComponent } from '@person-modals-selection/person-selection-modal.component';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-creating-event-person-table',
  templateUrl: './creating-event-person-table.component.html',
  styleUrls: ['./creating-event-person-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreatingEventPersonTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() modules: Array<ModuleModel> = [];
  @Input() isView: boolean = false;
  @Input() tableId: string = '';

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
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
      colDef: 'email',
      colTitleLocKey: 'personEmailColTable',
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['subdivision', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'registrationOnEventType',
      colTitleLocKey: 'registrationOnEventType',
      colGetValueFunc: this.getRegistrationOnEventTypeColValue(this),
    },
  ];

  constructor(
    public personService: PersonService,
    private injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updatePersonDataSource();
  }

  openPersonModal(): void {
    const modalRef = this.newModal.open(PersonSelectionModalComponent, {
      data: {
        selectedPersons: this.collectUniquePersonsFromModules(),
      },
    });
    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<PersonSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.changePersonDataSource(data.selectedPersons);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changePersonDataSource(selectedPersons: Array<PersonModel>): void {
    this.setPersonsToModules(selectedPersons);

    this.updatePersonDataSource();
  }

  private setPersonsToModules(selectedPersons: Array<PersonModel>): void {
    this.modules.forEach(module => {
      module.persons = selectedPersons;
    });
  }

  private collectUniquePersonsFromModules(): Array<PersonModel> {
    const uniquePersons: Array<PersonModel> = [];

    this.modules.forEach(module => {
      module.persons?.forEach(person => {
        const i = uniquePersons.findIndex(uniquePerson => {
          return uniquePerson.id === person.id;
        });

        if (i <= -1) {
          uniquePersons.push(person);
        }
      });
    });

    return uniquePersons;
  }

  updatePersonDataSource(): void {
    this.table.commonLoadTableHandler(this.collectUniquePersonsFromModules());
  }

  personOpenViewModal(personModel: PersonModel): void {
    this.newModal.open(CreateUpdatePersonModalComponent, {
      data: {
        model: personModel,
        isView: true,
      },
    });
  }

  removePersonFromList(targetPerson: PersonModel): void {
    this.modules.forEach(module => {
      module.persons = module.persons.filter(person => {
        return person.id !== targetPerson.id;
      });
    });

    this.updatePersonDataSource();
  }

  getRegistrationOnEventTypeColValue($self: CreatingEventPersonTableComponent): (person: PersonModel) => string {
    return (person: PersonModel): string => {
      const uniqueRegType: Set<string> = new Set();

      this.modules?.map(module => {
        return module.participantModuleCards
          ?.filter(pmc => pmc.person.id === person.id)
          .map(pmc => pmc.registrationOnEventType[$self.localization.getLocalFieldEnumName()])
          .forEach(regType => uniqueRegType.add(regType));
      });

      return uniqueRegType.size === 0
        ? $self.localization.getLocalTextFromKey('notRegistered')
        : [...uniqueRegType].join(', ');
    };
  }
}
