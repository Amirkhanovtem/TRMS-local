import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { TrainingTypeModel } from '@training-type-models/training-type.model';
import { TrainingTypeService } from '@training-type-services/training-type.service';

@Component({
  selector: 'app-create-update-training-type-modal',
  templateUrl: './create-update-training-type-modal.component.html',
  styleUrls: ['./create-update-training-type-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTrainingTypeModalComponent
  extends CommonCreateUpdateComponents<TrainingTypeModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  public trainingType: TrainingTypeModel = new TrainingTypeModel();

  constructor(
    private trainingTypeService: TrainingTypeService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadTrainingTypeDetail();
  }

  loadTrainingTypeDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.trainingTypeService.getTrainingType(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.trainingType = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  createOrSaveTrainingType(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.trainingTypeService
      .create(this.trainingType)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.trainingTypeService
      .update(this.trainingType)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }
}
