import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TrainingSummaryModel } from '@components/training-summary/models/training-summary.model';
import { TrainingSummaryService } from '@components/training-summary/services/training-summary.service';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class TrainingSummaryComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
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
      hidden: true,
    },
    {
      colDef: 'firstName',
      colTitleLocKey: 'personFirstNameColTable',
      modelPropertyPath: ['person', 'firstName'],
      hidden: true,
    },
    {
      colDef: 'patronymic',
      colTitleLocKey: 'personPatronymicColTable',
      modelPropertyPath: ['person', 'patronymic'],
      hidden: true,
    },
    {
      colDef: 'email',
      colTitleLocKey: 'personEmailColTable',
      modelPropertyPath: ['person', 'email'],
      hidden: true,
    },
    {
      colDef: 'username',
      colTitleLocKey: 'personUserNameColTable',
      modelPropertyPath: ['person', 'username'],
      hidden: true,
    },
    {
      colDef: 'trmsRole',
      colTitleLocKey: 'personTrmsRoleColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'trmsRole', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'personEmploymentDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'employmentDate'],
      hidden: true,
    },
    {
      colDef: 'position',
      colTitleLocKey: 'personPositionColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'position', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'personCostCenterColTable',
      modelPropertyPath: ['person', 'costCenter', 'name'],
      hidden: true,
    },
    {
      colDef: 'language',
      colTitleLocKey: 'personLanguageColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'language', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'city',
      colTitleLocKey: 'personCityColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'city', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'company',
      colTitleLocKey: 'personCompanyColTable',
      modelPropertyPath: ['person', 'company', 'name'],
      hidden: true,
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['person', 'subdivision', 'code'],
      hidden: true,
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'status', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'personnelType',
      colTitleLocKey: 'personnelTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'personnelType', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'dateOfBirth',
      colTitleLocKey: 'personDateOfBirthColTable',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'dateOfBirth'],
      hidden: true,
    },
    {
      colDef: 'gender',
      colTitleLocKey: 'personGenderColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'gender', this.localization.getLocalFieldEnumName()],
      hidden: true,
    },
    {
      colDef: 'placeOfBirth',
      colTitleLocKey: 'personPlaceOfBirthColTable',
      modelPropertyPath: ['person', 'placeOfBirth'],
      hidden: true,
    },
    {
      colDef: 'terminationDate',
      colTitleLocKey: 'personTerminationDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'terminationDate'],
      hidden: true,
    },
    {
      colDef: 'experience',
      colTitleLocKey: 'personExperienceColTable',
      modelPropertyPath: ['person', 'experience'],
      hidden: true,
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
      modelPropertyPath: ['person', 'personalNumber'],
    },
    {
      colDef: 'trainingTemplateName',
      colTitleLocKey: 'personTrainingTableTrainingTemplateCol',
      modelPropertyPath: ['trainingTemplate', 'name'],
    },
    {
      colDef: 'trainingTemplateCategoryName',
      colTitleLocKey: 'trainingSummaryReportTrainingTemplateCategoryNameColTable',
      modelPropertyPath: ['trainingTemplate', 'trainingCategory', 'name'],
    },
    {
      colDef: 'trainingTemplateCategoryCode',
      colTitleLocKey: 'trainingSummaryReportTrainingTemplateCategoryCodeColTable',
      modelPropertyPath: ['trainingTemplate', 'trainingCategory', 'code'],
    },
    {
      colDef: 'startDateTraining',
      colTitleLocKey: 'personTrainingTableTrainingStartDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'endDateTraining',
      colTitleLocKey: 'personTrainingTableTrainingEndDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'trainingTemplateFormat',
      colTitleLocKey: 'trainingTemplateFormatColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['trainingTemplate', 'format', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'trainingFactualStatus',
      colTitleLocKey: 'personTrainingTableTrainingFactualStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'attendanceStatus',
      colTitleLocKey: 'personTrainingTableTrainingAttendanceStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'certificate',
      colTitleLocKey: 'personTrainingTableDownloadCertificateCol',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'expireDateCertificate',
      colTitleLocKey: 'personTrainingTableCertificateExpiresDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'modules',
      colTitleLocKey: 'personTrainingTableModulesCol',
    },
  ];

  constructor(
    injector: Injector,
    private trainingSummaryService: TrainingSummaryService,
    public personService: PersonService,
    private commonAttachmentService: CommonAttachmentService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainingSummaryReport();
  }

  private loadTrainingSummaryReport() {
    this.table.loading = true;

    this.trainingSummaryService.getTrainingsSummary().subscribe({
      next: data => {
        this.preparePersonsModel(data);
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  private preparePersonsModel(data: Array<TrainingSummaryModel>): void {
    data.forEach(trainingSummary => {
      trainingSummary.person.experience = this.personService.calcExperience(trainingSummary.person, this.localization);
    });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.commonAttachmentService.loadFileById(fileId, fileName);
    }
  }
}
