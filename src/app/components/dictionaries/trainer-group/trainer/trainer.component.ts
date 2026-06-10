import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { PersonService } from '@person-services/person.service';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';
import { TrainerModel } from '@trainer-models/trainer.model';
import { TrainerService } from '@trainer-services/trainer.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainerComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public viewComponent: ComponentType<CreateUpdateTrainerModalComponent> = CreateUpdateTrainerModalComponent;
  public createUpdateComponent: ComponentType<CreateUpdateTrainerModalComponent> = CreateUpdateTrainerModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'fullNameRu',
      colTitleLocKey: 'personFullNameRuColTable',
      modelPropertyPath: ['person', 'fullNameRu'],
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
      modelPropertyPath: ['person', 'fullNameEn'],
    },
    {
      colDef: 'lastName',
      colTitleLocKey: 'personLastNameColTable',
      modelPropertyPath: ['person', 'lastName'],
    },
    {
      colDef: 'firstName',
      colTitleLocKey: 'personFirstNameColTable',
      modelPropertyPath: ['person', 'firstName'],
    },
    {
      colDef: 'patronymic',
      colTitleLocKey: 'personPatronymicColTable',
      modelPropertyPath: ['person', 'patronymic'],
    },
    {
      colDef: 'email',
      colTitleLocKey: 'personEmailColTable',
      modelPropertyPath: ['person', 'email'],
    },
    {
      colDef: 'username',
      colTitleLocKey: 'personUserNameColTable',
      modelPropertyPath: ['person', 'username'],
    },
    {
      colDef: 'trmsRole',
      colTitleLocKey: 'personTrmsRoleColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'trmsRole', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'personEmploymentDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'employmentDate'],
    },
    {
      colDef: 'position',
      colTitleLocKey: 'personPositionColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'position', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'trainerCategory',
      colTitleLocKey: 'trainerTrainerCategoryColTable',
      modelPropertyPath: ['trainerCategory', 'code'],
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'personCostCenterColTable',
      modelPropertyPath: ['person', 'costCenter', 'name'],
    },
    {
      colDef: 'language',
      colTitleLocKey: 'personLanguageColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'language', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'city',
      colTitleLocKey: 'personCityColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'city', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'company',
      colTitleLocKey: 'personCompanyColTable',
      modelPropertyPath: ['person', 'company', 'name'],
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['person', 'subdivision', 'code'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'status', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'personnelType',
      colTitleLocKey: 'personnelTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'personnelType', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'dateOfBirth',
      colTitleLocKey: 'personDateOfBirthColTable',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'dateOfBirth'],
    },
    {
      colDef: 'gender',
      colTitleLocKey: 'personGenderColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'gender', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'placeOfBirth',
      colTitleLocKey: 'personPlaceOfBirthColTable',
      modelPropertyPath: ['person', 'placeOfBirth'],
    },
    {
      colDef: 'experience',
      colTitleLocKey: 'personExperienceColTable',
      modelPropertyPath: ['person', 'experience'],
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
      modelPropertyPath: ['person', 'personalNumber'],
    },
  ];

  constructor(
    public trainerService: TrainerService,
    public personService: PersonService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainers();
  }

  public loadTrainers(): void {
    this.table.loading = true;

    this.trainerService.list().subscribe({
      next: data => {
        this.calcExperience(data);
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  calcExperience(trainers: Array<TrainerModel>): void {
    for (const trainer of trainers) {
      trainer.person.experience = this.personService.calcExperience(trainer?.person, this.localization);
    }
  }
}
