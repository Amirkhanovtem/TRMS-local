import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendedTrainingModel } from '@attended-training-models/attended-training.model';
import { AttendedTrainingService } from '@attended-training-services/attended-training.service';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ParticipantTrainingCardCertificateTemplateInfoEnum } from '@participation-card-models/participant-training-card-certificate-template-info.enum';
import { ParticipationCardService } from '@participation-card-services/participation-card.service';
import { PersonFioPipe } from '@person/pipes/person-fio.pipe';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-attended-training',
  templateUrl: './attended-training.component.html',
  styleUrls: ['./attended-training.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class AttendedTrainingComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'fullName',
      colTitleLocKey: 'attendedTrainingPersonFullNameColTable',
      modelPropertyPath: ['person'],
      colVisualValuePipe: new PersonFioPipe(),
    },
    {
      colDef: 'trainingName',
      colTitleLocKey: 'attendedTrainingTrainingNameColTable',
      modelPropertyPath: ['training', 'name'],
    },
    {
      colDef: 'trainingCategory',
      colTitleLocKey: 'attendedTrainingCategoryColTable',
      modelPropertyPath: ['training', 'trainingCategory', 'name'],
    },
    {
      colDef: 'startDate',
      colTitleLocKey: 'attendedTrainingStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
      modelPropertyPath: ['training', 'startDate'],
    },
    {
      colDef: 'endDate',
      colTitleLocKey: 'attendedTrainingEndDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
      modelPropertyPath: ['training', 'endDate'],
    },
    {
      colDef: 'certificate',
      colTitleLocKey: 'attendedTrainingCertificateColTable',
      modelPropertyPath: ['training', 'endDate'],
    },
  ];

  constructor(
    private attendedTrainingService: AttendedTrainingService,
    public personService: PersonService,
    private participationCardService: ParticipationCardService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedPerson: PersonModel;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadAttendedTrainings();
  }

  private loadAttendedTrainings(): void {
    this.table.loading = true;

    this.attendedTrainingService.list(this.dialogParams.selectedPerson.id).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public showEmptyCertificateTemplateError(attendedTraining: AttendedTrainingModel): boolean {
    const trainingCard = attendedTraining.participantTrainingCard,
      certificateTemplateInfo: ParticipantTrainingCardCertificateTemplateInfoEnum =
        ParticipantTrainingCardCertificateTemplateInfoEnum[trainingCard.certificateTemplateInfo.id];

    return (
      certificateTemplateInfo === ParticipantTrainingCardCertificateTemplateInfoEnum.HAS_CERTIFICATE_TEMPLATE &&
      !this.hasCertificate(attendedTraining)
    );
  }

  public hasCertificate(attendedTraining: AttendedTrainingModel): boolean {
    const trainingCard = attendedTraining.participantTrainingCard;

    return this.participationCardService.participationTrainingCardHasCertificate(trainingCard);
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }
}
