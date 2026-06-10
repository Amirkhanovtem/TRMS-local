import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { HistoricalDataModel } from '@components/integration/historical-data/models/historical-data.model';
import { HistoricalDataService } from '@components/integration/historical-data/services/historical-data.service';
import { Config } from '@config/config';

@Component({
  selector: 'app-historical-data-upload-modal',
  templateUrl: './historical-data-upload-modal.component.html',
  styleUrls: ['./historical-data-upload-modal.component.scss'],
  standalone: false,
})
export class HistoricalDataUploadModalComponent
  extends CommonCreateUpdateComponents<HistoricalDataModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  public historicalDataModel: HistoricalDataModel = new HistoricalDataModel();
  public allTypes: Array<StandardEnumModel> = [];

  constructor(
    injector: Injector,
    private historicalDataService: HistoricalDataService,
  ) {
    super(injector);
    this.createForm();
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadAllHistoricalDataTypes();
  }

  private loadAllHistoricalDataTypes(): void {
    this.historicalDataService.allHistoricalDataTypes().subscribe({
      next: data => {
        this.allTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  getAllowedFileFormats(): string {
    return Config.ALLOWED_HISTORICAL_DATA_FORMATS;
  }

  public uploadHistoricalData(): void {
    this.modalForm.markAsTouched();

    if (!this.historicalDataModel.fileStorage.templateFile) {
      this.showSnackBarWithMessage(
        this.localization.getLocalTextFromKey('validatorsFileIsEmptyErrorMessage'),
        SnackBarTypeEnum.ERROR,
      );
      return;
    }

    if (this.modalForm.valid) {
      this.historicalDataService.upload(this.historicalDataModel).subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }
}
