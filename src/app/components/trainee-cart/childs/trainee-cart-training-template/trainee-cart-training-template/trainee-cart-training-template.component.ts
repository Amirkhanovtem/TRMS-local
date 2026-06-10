import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateUpdateCertificateTemplateModalComponent } from '@certificate-template-modals-create-update/create-update-certificate-template-modal.component';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CommonComponent } from '@common-components/common.component';
import { TraineeCartFilterService } from '@components/trainee-cart/services/trainee-cart-filter.service';
import { CreateUpdateTrainingTemplateModalComponent } from '@training-template-modals-create-update/create-update-training-template-modal.component';
import { TrainingTemplateSelectionModalComponent } from '@training-template-modals-selection/training-template-selection-modal.component';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trainee-cart-training-template',
  templateUrl: './trainee-cart-training-template.component.html',
  styleUrls: ['./trainee-cart-training-template.component.scss'],
  standalone: false,
})
export class TraineeCartTrainingTemplateComponent extends CommonComponent implements OnInit {
  public selectedTrainingTemplates$: BehaviorSubject<Array<TrainingTemplateModel>> = new BehaviorSubject<
    Array<TrainingTemplateModel>
  >([]);
  public clickedTrainingTemplate$: BehaviorSubject<TrainingTemplateModel> = new BehaviorSubject<TrainingTemplateModel>(
    null,
  );

  constructor(
    private traineeCartFilterService: TraineeCartFilterService,
    injector: Injector,
  ) {
    super(injector);
  }

  public openTrainingTemplateSelectionModal(): void {
    const modalRef = this.newModal.open(TrainingTemplateSelectionModalComponent, {
      data: {
        selectedTrainingTemplates: this.selectedTrainingTemplates$.value,
      },
    });
    this.closeModalHandler(modalRef);
  }

  ngOnInit(): void {
    this.loadSelectedTrainingTemplatesByCurrentUser();
  }

  private closeModalHandler(modalRef: MatDialogRef<TrainingTemplateSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.trainingTemplateSelectionHandler(data.selectedTrainingTemplates);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private trainingTemplateSelectionHandler(selectedTrainingTemplates: Array<TrainingTemplateModel>): void {
    this.selectedTrainingTemplates$.next(selectedTrainingTemplates);
    this.saveSelectedTrainingTemplatesByCurrentUser(selectedTrainingTemplates);
  }

  private saveSelectedTrainingTemplatesByCurrentUser(selectedTrainingTemplates: Array<TrainingTemplateModel>): void {
    const trainingTemplateIds: Array<string> = selectedTrainingTemplates.map(tt => tt.id);

    this.traineeCartFilterService.saveSelectedTrainingTemplatesByCurrentUser(trainingTemplateIds).subscribe({
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadSelectedTrainingTemplatesByCurrentUser(): void {
    this.traineeCartFilterService.loadSelectedTrainingTemplatesByCurrentUser().subscribe({
      next: data => {
        this.selectedTrainingTemplates$.next(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public getCertificateDescription(certificateTemplate: CertificateTemplateModel): string {
    if (!certificateTemplate) {
      return this.localization.getLocalTextFromKey('traineeCartTrainingTemplateCertificateNotLinked');
    }

    const certificateName: string = certificateTemplate.name,
      certificateDurationType: string =
        certificateTemplate.certificateDurationSettings?.durationType[this.localization.getLocalFieldEnumName()];

    return `${certificateName} (${certificateDurationType})`;
  }

  public openTrainingTemplateViewModal(trainingTemplate: TrainingTemplateModel): void {
    if (!trainingTemplate) {
      return;
    }

    this.newModal.open(CreateUpdateTrainingTemplateModalComponent, {
      data: {
        model: trainingTemplate,
        isView: true,
      },
    });
  }

  public listItemClickHandler(trainingTemplate: TrainingTemplateModel): void {
    this.clickedTrainingTemplate$.next(trainingTemplate);
  }

  public openCertificateTemplateViewModal(certificateTemplate: CertificateTemplateModel): void {
    if (!certificateTemplate) {
      return;
    }

    this.newModal.open(CreateUpdateCertificateTemplateModalComponent, {
      data: {
        model: certificateTemplate,
        isView: true,
      },
    });
  }

  public isSelected(trainingTemplateId: string): boolean {
    return trainingTemplateId === this.clickedTrainingTemplate$.value?.id;
  }
}
