import { Component, EventEmitter, Injector, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityModel } from '@city-models/city.model';
import { CommonComponent } from '@common-components/common.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { SelfEnrollmentFilterModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-filters/models/self-enrollment-filter.model';
import { SelfEnrollmentService } from '@components/self-enrlloment/self-enrollment-page/service/self-enrollment.service';
import { APP_CONSTANTS } from '@config/app.constants';
import { ResponsiveService } from '@services/responsive.service';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-self-enrollment-filters',
  templateUrl: './self-enrollment-filters.component.html',
  styleUrls: ['./self-enrollment-filters.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class SelfEnrollmentFiltersComponent extends CommonComponent implements OnDestroy {
  @Output() acceptFiltersOutput: EventEmitter<SelfEnrollmentFilterModel> = new EventEmitter();
  form: FormGroup;
  filters: SelfEnrollmentFilterModel = new SelfEnrollmentFilterModel();
  trainingTemplates: Array<StandardNameIdModel> = [];
  filteredTrainingTemplates: Array<StandardNameIdModel> = [];
  cities: Array<CityModel> = [];
  filteredCities: Array<CityModel> = [];
  isMobileView: boolean = false;
  stepwiseActivation: boolean = false;
  private mobileSubscription: Subscription;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private selfEnrollmentService: SelfEnrollmentService,
    private responsiveService: ResponsiveService,
  ) {
    super(injector);
    this.createForm();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.loadFilters();

    this.mobileSubscription = this.responsiveService.isMobile$.subscribe(isMobile => {
      this.isMobileView = isMobile;
      this.stepwiseActivation = isMobile;
      this.setupStepwiseActivation();
    });
  }

  ngOnDestroy() {
    if (this.mobileSubscription) {
      this.mobileSubscription.unsubscribe();
    }
  }

  // Helper methods to reduce repeated form?.get() calls
  private get cityControl(): AbstractControl | null {
    return this.form?.get('city');
  }
  private get startDateControl(): AbstractControl | null {
    return this.form?.get('startDate');
  }
  private get endDateControl(): AbstractControl | null {
    return this.form?.get('endDate');
  }

  private enableFormFields(...fieldNames: Array<string>): void {
    fieldNames.forEach(name => this.form?.get(name)?.enable());
  }

  private disableFormFields(...fieldNames: Array<string>): void {
    fieldNames.forEach(name => this.form?.get(name)?.disable());
  }

  private setupStepwiseActivation(): void {
    if (!this.stepwiseActivation || !this.form) {
      this.enableFormFields('city', 'startDate', 'endDate');
      return;
    }

    this.disableFormFields('city', 'startDate', 'endDate');

    this.onTrainingSelectionChange();
    this.onCitySelectionChange();
  }

  private onTrainingSelectionChange(): void {
    if (this.filters.trainingTemplateIds?.length > 0) {
      this.cityControl?.enable();
    } else {
      this.cityControl?.disable();
      this.filters.cityIds = [];
      this.disableFormFields('startDate', 'endDate');
    }
  }

  private onCitySelectionChange(): void {
    if (this.filters.cityIds?.length > 0 && this.filters.trainingTemplateIds?.length > 0) {
      this.enableFormFields('startDate', 'endDate');
    } else if (this.filters.trainingTemplateIds?.length === 0) {
      this.disableFormFields('startDate', 'endDate');
    }
  }

  public onTrainingChange(): void {
    if (this.stepwiseActivation) {
      this.onTrainingSelectionChange();
    }
  }

  public onCityChange(): void {
    if (this.stepwiseActivation) {
      this.onCitySelectionChange();
    }
  }

  private loadFilters(): void {
    this.loadTrainingTemplateFilters();
    this.loadCityFilters();
  }

  private loadTrainingTemplateFilters(): void {
    this.selfEnrollmentService.getTrainingTemplateFilter().subscribe({
      next: data => {
        this.loadTrainingTemplateFiltersSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadTrainingTemplateFiltersSuccessHandler(data: Array<TrainingTemplateModel>): void {
    this.trainingTemplates = data;
    this.filterTrainingTemplates('');
  }

  filterTrainingTemplates(search: string): void {
    this.filteredTrainingTemplates = this.trainingTemplates.filter(trainingTemplate => {
      return trainingTemplate.name?.toLowerCase().includes(search?.toLowerCase());
    });
  }

  filterCities(search: string): void {
    this.filteredCities = this.cities.filter(city => {
      return city[this.localEnumField]?.toLowerCase().includes(search?.toLowerCase());
    });
  }

  private loadCityFilters(): void {
    this.selfEnrollmentService.getCityFilter().subscribe({
      next: data => {
        this.loadCityFiltersSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadCityFiltersSuccessHandler(data: Array<CityModel>): void {
    this.cities = data;
    this.filterCities('');
  }

  public activeDatesFilters: (date: Moment) => boolean = (date: Moment): boolean => {
    return date.isAfter(moment().startOf('day'));
  };

  private createForm(): void {
    this.form = this.formBuilder.group({
      city: [{ value: null, disabled: this.stepwiseActivation }],
      startDate: [{ value: moment(), disabled: this.stepwiseActivation }, [Validators.required]],
      endDate: [
        { value: moment().add(APP_CONSTANTS.DEFAULT_DATE_RANGE_DAYS, 'days'), disabled: this.stepwiseActivation },
        [Validators.required],
      ],
    });
  }

  public confirmFilters(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.acceptFiltersOutput?.emit(this.filters);
  }

  public canSubmit(): boolean {
    return this.isFormValid() && this.areRequiredFieldsFilled();
  }

  private areRequiredFieldsFilled(): boolean {
    return (
      this.filters.trainingTemplateIds?.length > 0 &&
      this.filters.cityIds?.length > 0 &&
      this.startDateControl?.value &&
      this.endDateControl?.value
    );
  }

  public clearFilters(): void {
    this.filters = new SelfEnrollmentFilterModel();
    this.createForm();
    if (this.stepwiseActivation) {
      this.setupStepwiseActivation();
    }
  }

  public isFormValid(): boolean {
    return this.form?.valid;
  }
}
