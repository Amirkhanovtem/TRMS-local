import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { GanttFilterService } from '@gantt-modals-filter-selection-services/gantt-filter.service';
import { GanttRangeEnum } from '@gantt-modals-view-selection-models/gantt-range.enum';
import { GanttViewEnum } from '@gantt-modals-view-selection-models/gantt-view.enum';
import { GanttViewRangeData } from '@gantt-modals-view-selection-models/gantt-view-range-data.model';
import { GanttService } from '@gantt-services/gantt.service';
import { Cit } from 'cit-angular';

@Component({
  selector: 'app-gantt-view-selection-modal',
  templateUrl: './gantt-view-selection-modal.component.html',
  styleUrls: ['./gantt-view-selection-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class GanttViewSelectionModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  modalForm: FormGroup;
  public static readonly DEFAULT_VIEW: GanttViewEnum = GanttViewEnum.BY_DAY;
  public static readonly DEFAULT_RANGE: GanttRangeEnum = GanttRangeEnum.WEEK;

  public readonly viewLocalMessagePrefix = 'ganttView.';
  public readonly rangeLocalMessagePrefix = 'ganttRange.';

  public ganttViews: Array<GanttViewEnum> = Object.values(GanttViewEnum);
  public ganttRanges: Array<GanttRangeEnum> = Object.values(GanttRangeEnum);

  public selectedGanttView: GanttViewEnum = GanttViewSelectionModalComponent.DEFAULT_VIEW;
  public selectedGanttRange: GanttRangeEnum = GanttViewSelectionModalComponent.DEFAULT_RANGE;
  public selectedStartDate: Cit.Date = null;
  public selectedEndDate: Cit.Date = null;

  constructor(
    injector: Injector,
    private ganttService: GanttService,
    private formBuilder: FormBuilder,
    private ganttFilterService: GanttFilterService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      ganttViewRangeData: GanttViewRangeData;
    },
  ) {
    super(injector);
    this.createForm();
    this.setDefaultRangeView();
  }

  createForm(): void {
    const currentDate = new Date();

    this.modalForm = this.formBuilder.group({
      startDate: [currentDate, [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  setDefaultRangeView(): void {
    const ganttRangeString: string = this.dialogParams.ganttViewRangeData.ganttRange.id,
      ganttViewString: string = this.dialogParams.ganttViewRangeData.ganttView.id;

    this.selectedGanttRange = GanttRangeEnum[ganttRangeString]
      ? GanttRangeEnum[ganttRangeString]
      : GanttViewSelectionModalComponent.DEFAULT_RANGE;
    this.selectedGanttView = GanttViewEnum[ganttViewString]
      ? GanttViewEnum[ganttViewString]
      : GanttViewSelectionModalComponent.DEFAULT_VIEW;

    this.selectedStartDate = Cit.Date.now();
  }

  getDefaultRange(): GanttRangeEnum {
    return GanttViewSelectionModalComponent.DEFAULT_RANGE;
  }

  getDefaultView(): GanttViewEnum {
    return GanttViewSelectionModalComponent.DEFAULT_VIEW;
  }

  ganttViewChanged(value: GanttViewEnum): void {
    this.selectedGanttView = value;
  }

  ganttRangeChanged(value: GanttRangeEnum): void {
    this.selectedGanttRange = value;
  }

  startDateChanged($event): void {
    this.selectedStartDate = this.ganttService.getCitDateFromIsoDate($event?.value?._d);
  }

  endDateChanged($event): void {
    this.selectedEndDate = this.ganttService.getCitDateFromIsoDate($event?.value?._d);
  }

  isDateRange(): boolean {
    return this.selectedGanttRange === GanttRangeEnum.RANGE;
  }

  confirm(): void {
    this.modalForm.markAllAsTouched();

    if (!this.validateDate()) {
      return;
    }

    const ganttViewRangeData = this.getGanttViewRangeModel();

    this.ganttFilterService.saveRange(ganttViewRangeData).subscribe({
      next: data => {
        this.modalComponent.modal.close(ganttViewRangeData);
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  errorHandler(error): void {
    const errorBody = error.error;

    if (!errorBody) {
      this.errorResponseHandler(error);
    } else {
      this.showSnackBarWithMessage(errorBody.message, SnackBarTypeEnum.ERROR);
    }
  }

  isInvalidDate(): boolean {
    return this.modalForm.touched && !this.validateDate();
  }

  validateDate(): boolean {
    let result: boolean = this.modalForm.get('startDate').valid;

    if (this.isDateRange()) {
      result = result && this.modalForm.get('endDate').valid;
    }

    return result;
  }

  getGanttViewRangeModel(): GanttViewRangeData {
    const ganttViewData = new GanttViewRangeData(this.selectedGanttRange, this.selectedGanttView);

    ganttViewData.startDate = this.selectedStartDate;
    ganttViewData.endDate = this.selectedEndDate;

    return ganttViewData;
  }
}
