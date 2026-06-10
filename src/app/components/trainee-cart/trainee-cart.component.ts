import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CertificateDurationTypeEnum } from '@certificate-template-models/certificate-duration-type.enum';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateModel } from '@components/certificate/certificate/models/certificate.model';
import { TraineeCartDetailTableComponent } from '@components/trainee-cart/childs/trainee-cart-detail-table/trainee-cart-detail-table.component';
import { TraineeCartTrainingTemplateComponent } from '@components/trainee-cart/childs/trainee-cart-training-template/trainee-cart-training-template/trainee-cart-training-template.component';
import { TraineeCartModel } from '@components/trainee-cart/models/trainee-cart.model';
import { TraineeCartCertificateStateEnum } from '@components/trainee-cart/models/trainee-cart-certificate-state.enum';
import { TraineeCartCertificateVisualInfoModel } from '@components/trainee-cart/models/trainee-cart-certificate-visual-info.model';
import { TraineeCartService } from '@components/trainee-cart/services/trainee-cart.service';
import { PersonService } from '@person-services/person.service';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-trainee-cart',
  templateUrl: './trainee-cart.component.html',
  styleUrls: ['./trainee-cart.component.scss'],
  standalone: false,
})
export class TraineeCartComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild(TraineeCartDetailTableComponent) detailTable: TraineeCartDetailTableComponent;
  @ViewChild(TraineeCartTrainingTemplateComponent)
  traineeCartTrainingTemplateComponent: TraineeCartTrainingTemplateComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  private defaultCols: Array<DisplayedColumnInterface> = [
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
      modelPropertyPath: ['person', 'personalNumber'],
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
      modelPropertyPath: ['person', 'fullNameEn'],
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
      modelPropertyPath: ['person', 'position', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'personCostCenterColTable',
      modelPropertyPath: ['person', 'costCenter', 'name'],
    },
    {
      colDef: 'experience',
      colTitleLocKey: 'personExperienceColTable',
      modelPropertyPath: ['person', 'experience'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'personStatusColTable',
      modelPropertyPath: ['person', 'status', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'company',
      colTitleLocKey: 'personCompanyColTable',
      modelPropertyPath: ['person', 'company', 'name'],
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['person', 'subdivision', this.localization.getLocalFieldEnumName()],
    },
  ];
  public displayedColumns: Array<DisplayedColumnInterface> = this.cloneDefaultCols();
  public trainingTemplates: Array<TrainingTemplateModel> = [];

  constructor(
    public traineeCartService: TraineeCartService,
    public personService: PersonService,
    public commonDateTimeService: CommonDateTimeService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.subscribeOnTrainingTemplateDataUpdate();
  }

  public get clickedTrainingTemplate(): TrainingTemplateModel {
    return this.traineeCartTrainingTemplateComponent?.clickedTrainingTemplate$.value;
  }

  private subscribeOnTrainingTemplateDataUpdate(): void {
    this.traineeCartTrainingTemplateComponent?.selectedTrainingTemplates$.subscribe({
      next: data => {
        this.trainingTemplateTableUpdateHandler(data);
      },
    });

    this.traineeCartTrainingTemplateComponent?.clickedTrainingTemplate$.subscribe({
      next: data => {
        this.updateDetailInfoTable();
      },
    });
  }

  private trainingTemplateTableUpdateHandler(trainingTemplates: Array<TrainingTemplateModel>): void {
    const trainingTemplateIds: Array<string> = trainingTemplates
      .map(trainingTemplate => trainingTemplate.id)
      .filter(id => id !== null);

    this.trainingTemplates = trainingTemplates;
    this.prepareTableColsByTrainingTemplates(trainingTemplates);
    this.loadTraineeCartsByTrainingTemplateIds(trainingTemplateIds);
  }

  private prepareTableColsByTrainingTemplates(trainingTemplates: Array<TrainingTemplateModel>): void {
    this.displayedColumns = this.cloneDefaultCols();

    trainingTemplates.forEach(trainingTemplate => {
      const getCertificateVisualInfo = (traineeCart: TraineeCartModel) => {
        return traineeCart.certificateVisualInfoByTrainingTemplateMap.get(trainingTemplate.id);
      };

      this.displayedColumns.push({
        colDef: trainingTemplate.id,
        colTitleLocKey: trainingTemplate.name,
        colGetValueFunc: (traineeCart: TraineeCartModel) => getCertificateVisualInfo(traineeCart)?.cellValue,
      });
    });

    this.table.updateTableVisual();
  }

  private cloneDefaultCols(): Array<DisplayedColumnInterface> {
    return Object.assign([], this.defaultCols);
  }

  private loadTraineeCartsByTrainingTemplateIds(trainingTemplateIds: Array<string>): void {
    this.table.loading = true;

    if (!trainingTemplateIds || !trainingTemplateIds.length) {
      this.table.commonLoadTableHandler([]);
      return;
    }

    this.traineeCartService.listWithTrainingTemplates(trainingTemplateIds).subscribe({
      next: data => {
        this.loadTraineeCartDataHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  private loadTraineeCartDataHandler(traineeCarts: Array<TraineeCartModel>): void {
    this.calculateAdditionalInfo(traineeCarts);
    this.table.commonLoadTableHandler(traineeCarts);
    this.updateDetailInfoTable();
  }

  private calculateAdditionalInfo(traineeCarts: Array<TraineeCartModel>): void {
    for (const traineeCart of traineeCarts) {
      this.calcExperience(traineeCart);
      this.calcTraineeCartCertificateAdditionalInfo(traineeCart);
    }
  }

  private calcExperience(traineeCart: TraineeCartModel): void {
    traineeCart.person.experience = this.personService.calcExperience(traineeCart?.person, this.localization);
  }

  private calcTraineeCartCertificateAdditionalInfo(traineeCart: TraineeCartModel): void {
    const certificateVisualInfoByTrainingTemplateMap: Map<string, TraineeCartCertificateVisualInfoModel> = new Map<
      string,
      TraineeCartCertificateVisualInfoModel
    >();

    for (const trainingTemplateId of Object.keys(traineeCart.certificateByTrainingTemplateMap)) {
      const certificateInfo: TraineeCartCertificateVisualInfoModel = this.getCertificateVisualInfo(
        trainingTemplateId,
        traineeCart,
      );
      certificateVisualInfoByTrainingTemplateMap.set(trainingTemplateId, certificateInfo);
    }

    traineeCart.certificateVisualInfoByTrainingTemplateMap = certificateVisualInfoByTrainingTemplateMap;
  }

  private getCertificate(trainingTemplateId: string, traineeCart: TraineeCartModel): CertificateModel {
    return traineeCart.certificateByTrainingTemplateMap?.[trainingTemplateId]?.['certificate'];
  }

  private getPlannedTraining(trainingTemplateId: string, traineeCart: TraineeCartModel): CertificateModel {
    return traineeCart.certificateByTrainingTemplateMap?.[trainingTemplateId]?.['plannedTraining'];
  }

  private getCertificateVisualInfo(
    trainingTemplateId: string,
    traineeCart: TraineeCartModel,
  ): TraineeCartCertificateVisualInfoModel {
    const certificate: CertificateModel = this.getCertificate(trainingTemplateId, traineeCart);

    if (!certificate) {
      return this.getCertificateVisualInfoByStatus(TraineeCartCertificateStateEnum.NOT_ISSUED);
    }

    const certificateDurationType: StandardEnumModel = certificate.certificateDurationSettings?.durationType;

    if (certificateDurationType?.id === CertificateDurationTypeEnum.INFINITE) {
      return this.getCertificateVisualInfoByStatus(TraineeCartCertificateStateEnum.INFINITE);
    }

    const monthsOffsetToExpire: number = 1,
      dateOfExpire: Moment = moment(certificate.dateOfExpire),
      targetDate: Moment = moment().add(monthsOffsetToExpire, 'month'),
      status: TraineeCartCertificateStateEnum =
        targetDate >= dateOfExpire ? TraineeCartCertificateStateEnum.EXPIRED : TraineeCartCertificateStateEnum.ACTIVE;

    return this.getCertificateVisualInfoByStatus(status);
  }

  private getCertificateVisualInfoByStatus(
    certificateState: TraineeCartCertificateStateEnum,
  ): TraineeCartCertificateVisualInfoModel {
    const value: string = this.localization.getLocalTextFromKey(`traineeCartCertificateInfo.${certificateState}`);

    return {
      cellValue: value,
      filterValue: value,
      state: certificateState,
    };
  }

  public updateDetailInfoTable(): void {
    const trainingTemplate: TrainingTemplateModel = this.clickedTrainingTemplate;

    if (!trainingTemplate) {
      return;
    }

    const filteredData: Array<TraineeCartModel> = this.table.dataSource.filteredData,
      trainingTemplateId: string = trainingTemplate.id;

    const detailData = filteredData.map(traineeCart => {
      return {
        person: traineeCart.person,
        certificate: this.getCertificate(trainingTemplateId, traineeCart),
        certificateVisualInfo: traineeCart.certificateVisualInfoByTrainingTemplateMap.get(trainingTemplateId),
        plannedTraining: this.getPlannedTraining(trainingTemplateId, traineeCart),
      };
    });

    setTimeout(() => {
      this.detailTable.setSelectedTrainingTemplate(trainingTemplate);
      this.detailTable.table.commonLoadTableHandler(detailData);
    }, 0);
  }
}
