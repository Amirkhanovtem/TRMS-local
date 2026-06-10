import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { GenerateParticipationSheetModel } from '@participation-card-models/generate-participation-sheet.model';
import { GenerateParticipationSheetService } from '@participation-card-services/generate-participation-sheet.service';

@Component({
  selector: 'app-generate-participation-sheet-modal',
  templateUrl: './generate-participation-sheet-modal.component.html',
  styleUrls: ['./generate-participation-sheet-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class GenerateParticipationSheetModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  selectedFormats: StandardEnumModel = new StandardEnumModel();
  allParticipationSheetList: Array<StandardEnumModel> = [];

  constructor(
    injector: Injector,
    private generateParticipationSheetService: GenerateParticipationSheetService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      trainingId: string;
    },
  ) {
    super(injector);
    this.loadAllParticipationSheetFormats();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  loadAllParticipationSheetFormats(): void {
    this.generateParticipationSheetService.getAllParticipationSheetFormats().subscribe({
      next: data => {
        this.successLoadAllParticipationSheetFormatsHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  successLoadAllParticipationSheetFormatsHandler(data): void {
    this.allParticipationSheetList = data;
    this.selectedFormats = this.allParticipationSheetList[0];
  }

  getGenerateParticipationSheetModel(): GenerateParticipationSheetModel {
    const generateParticipationSheetModel: GenerateParticipationSheetModel = new GenerateParticipationSheetModel();

    generateParticipationSheetModel.training.id = this.dialogParams.trainingId;
    generateParticipationSheetModel.trainingAttendanceType = this.selectedFormats;

    return generateParticipationSheetModel;
  }

  downLoadParticipationSheet(): void {
    this.generateParticipationSheetService
      .generateAndDownloadParticipationSheet(this.getGenerateParticipationSheetModel())
      .subscribe({
        next: data => {
          this.successDownloadHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  successDownloadHandler(resp): void {
    this.modalComponent.closeBtnAction();
    this.generateParticipationSheetService.downloadFileSuccessHandler(resp);
  }
}
