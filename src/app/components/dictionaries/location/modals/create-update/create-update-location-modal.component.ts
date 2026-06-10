import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CityModel } from '@city-models/city.model';
import { CityService } from '@city-services/city.service';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { LocationModel } from '@location-models/location.model';
import { LocationService } from '@location-services/location.service';

@Component({
  selector: 'app-create-update-location-modal',
  templateUrl: './create-update-location-modal.component.html',
  styleUrls: ['./create-update-location-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateLocationModalComponent extends CommonCreateUpdateComponents<LocationModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public location: LocationModel = new LocationModel();
  public cities: Array<CityModel> = [];

  constructor(
    private locationService: LocationService,
    injector: Injector,
    private cityService: CityService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadLocationDetail();
    this.loadCities();
  }

  loadLocationDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.locationService.getLocation(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.location = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadCities(): void {
    this.cityService.getIdNameList().subscribe({
      next: data => {
        this.cities = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      address: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
      city: [{ value: '', disabled: this.dialogParams?.isView }, [Validators.required]],
    });
  }

  createOrSaveLocation(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.locationService
      .create(this.location)
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
    this.locationService
      .update(this.location)
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
