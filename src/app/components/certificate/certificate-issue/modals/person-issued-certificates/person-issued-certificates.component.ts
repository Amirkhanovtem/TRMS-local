import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateIssueModel } from '@components/certificate/certificate-issue/models/certificate-issue.model';
import { CertificateIssueService } from '@components/certificate/certificate-issue/services/certificate-issue.service';
import { ParticipantTrainingCardCertificateTemplateInfoEnum } from '@participation-card-models/participant-training-card-certificate-template-info.enum';
import { ParticipationCardService } from '@participation-card-services/participation-card.service';
import { PersonFioPipe } from '@person/pipes/person-fio.pipe';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-person-issued-certificates',
  templateUrl: './person-issued-certificates.component.html',
  styleUrls: ['./person-issued-certificates.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class PersonIssuedCertificatesComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'certificateIssueCertificateNameColTable',
    },
    {
      colDef: 'trainingName',
      colTitleLocKey: 'certificateIssueTrainingNameColTable',
    },
    {
      colDef: 'dateOfIssue',
      colTitleLocKey: 'certificateIssueDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'dateOfExpire',
      colTitleLocKey: 'certificateIssueExpireThroughColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'fullName',
      colTitleLocKey: 'certificateIssueFullNameColTable',
      modelPropertyPath: [],
      colVisualValuePipe: new PersonFioPipe(),
    },
    {
      colDef: 'certificate',
      colTitleLocKey: 'certificateIssueCertificateColTable',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
  ];

  constructor(
    private certificateIssueService: CertificateIssueService,
    injector: Injector,
    private personService: PersonService,
    private participationCardService: ParticipationCardService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedPerson: PersonModel;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCertificateIssues();
  }

  private loadCertificateIssues(): void {
    this.table.loading = true;

    this.certificateIssueService.getCertificatesByPersonId(this.dialogParams?.selectedPerson?.id).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  public showEmptyCertificateTemplateError(certificateIssue: CertificateIssueModel): boolean {
    const trainingCard = certificateIssue.participantTrainingCard,
      hasCertificate: boolean = this.participationCardService.participationTrainingCardHasCertificate(trainingCard),
      certificateTemplateInfo: ParticipantTrainingCardCertificateTemplateInfoEnum =
        ParticipantTrainingCardCertificateTemplateInfoEnum[trainingCard.certificateTemplateInfo.id];

    return (
      certificateTemplateInfo === ParticipantTrainingCardCertificateTemplateInfoEnum.HAS_CERTIFICATE_TEMPLATE &&
      !hasCertificate
    );
  }

  public getFormTitle(): string {
    const personFullName = this.personService.getFullName(this.dialogParams?.selectedPerson),
      params: Map<string, string> = new Map<string, string>([['personFullName', personFullName]]);

    return this.localization.getLocalFormattedTextFromKey('certificateIssueByPersonPageTitle', params);
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }
}
