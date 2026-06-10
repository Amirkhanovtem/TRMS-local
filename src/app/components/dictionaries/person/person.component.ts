import { ComponentType } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { AttendedTrainingComponent } from '@attended-training/attended-training.component';
import { PersonIssuedCertificatesComponent } from '@certificate-issue-modals/person-issued-certificates/person-issued-certificates.component';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { Role } from '@config/role';
import { CreateUpdatePersonModalComponent } from '@person-modals-create-update/create-update-person-modal.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class PersonComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdatePersonModalComponent> = CreateUpdatePersonModalComponent;
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
      colDef: 'patronymic',
      colTitleLocKey: 'personPatronymicColTable',
    },
    {
      colDef: 'email',
      colTitleLocKey: 'personEmailColTable',
    },
    {
      colDef: 'username',
      colTitleLocKey: 'personUserNameColTable',
    },
    {
      colDef: 'trmsRole',
      colTitleLocKey: 'personTrmsRoleColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'personEmploymentDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
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
      colDef: 'language',
      colTitleLocKey: 'personLanguageColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
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
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['subdivision', 'code'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'personnelType',
      colTitleLocKey: 'personnelTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'dateOfBirth',
      colTitleLocKey: 'personDateOfBirthColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'gender',
      colTitleLocKey: 'personGenderColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'placeOfBirth',
      colTitleLocKey: 'personPlaceOfBirthColTable',
    },
    {
      colDef: 'terminationDate',
      colTitleLocKey: 'personTerminationDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'experience',
      colTitleLocKey: 'personExperienceColTable',
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
    },
  ];

  checkBtnEnable(btnName: string): boolean {
    let availableRoles: Array<string> = [];

    switch (btnName) {
      case 'personTrainings':
      case 'personCertificatesBtn': {
        availableRoles = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];
        break;
      }
    }

    return this.roles.some(role => availableRoles.includes(role));
  }

  openPersonAttendedTrainingsModal(): void {
    const selected = this.table.selection.selected;

    if (selected.length !== 1) return;

    this.newModal.open(AttendedTrainingComponent, {
      data: {
        selectedPerson: selected[0],
      },
    });
  }

  openPersonIssuedCertificatesModal(): void {
    const selected = this.table.selection.selected;

    if (selected.length !== 1) {
      return;
    }

    this.newModal.open(PersonIssuedCertificatesComponent, {
      data: {
        selectedPerson: selected[0],
      },
    });
  }
}
