import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CityModel } from '@city-models/city.model';
import { CityService } from '@city-services/city.service';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';

@Component({
  selector: 'app-create-update-city-modal',
  templateUrl: './create-update-city-modal.component.html',
  styleUrls: ['./create-update-city-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateCityModalComponent extends CommonCreateUpdateComponents<CityModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public city: CityModel = new CityModel();

  constructor(
    private cityService: CityService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCityDetail();
  }

  loadCityDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.cityService.getCity(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.city = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      nameRu: ['', [Validators.required, this.noWhitespaceValidator]],
      nameKz: ['', [Validators.required, this.noWhitespaceValidator]],
      nameEn: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
    });
  }

  createOrSaveCity(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.cityService
      .create(this.city)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.cityService
      .update(this.city)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  errorHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });
  }

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }
}
