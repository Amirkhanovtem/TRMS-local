import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { RegistrationOnEventType } from '@components/event/enums/registration-on-event-type.enum';
import { SelfEnrollmentEventModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/models/self-enrollment-event.model';
import { TrainingSelfEnrollmentModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/models/training-self-enrollment.model';
import { SelfEnrollmentFilterModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-filters/models/self-enrollment-filter.model';
import { SelfEnrollmentService } from '@components/self-enrlloment/self-enrollment-page/service/self-enrollment.service';
import { ResponsiveService } from '@services/responsive.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-self-enrollment-events',
  templateUrl: './self-enrollment-events.component.html',
  styleUrls: ['./self-enrollment-events.component.scss'],
  standalone: false,
})
export class SelfEnrollmentEventsComponent extends CommonComponent implements OnInit, OnDestroy {
  public readonly REGISTRATION_TYPE_IN_PROCESS: StandardEnumModel = { id: RegistrationOnEventType.IN_PROCESS };
  public readonly WARNING_SPOTS_COUNT: number = 3;
  public readonly SHORT_EVENTS_COUNT: number = 3;
  public readonly RegistrationOnEventType = RegistrationOnEventType;
  trainingTemplateEventsList: Array<TrainingSelfEnrollmentModel> = [];
  showAllEvents: Array<string> = [];
  isMobileView: boolean = false;
  private mobileSubscription: Subscription;

  constructor(
    injector: Injector,
    private selfEnrollmentService: SelfEnrollmentService,
    private responsiveService: ResponsiveService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.mobileSubscription = this.responsiveService.isMobile$.subscribe(isMobile => {
      this.isMobileView = isMobile;
    });
    this.loadEventsByFilter(new SelfEnrollmentFilterModel());
  }

  ngOnDestroy() {
    if (this.mobileSubscription) {
      this.mobileSubscription.unsubscribe();
    }
  }

  public loadEventsByFilter(filters: SelfEnrollmentFilterModel): void {
    this.selfEnrollmentService.getEventsData(filters).subscribe({
      next: data => (this.trainingTemplateEventsList = data),
      error: e => this.errorResponseHandler(e),
    });
  }

  public enroll(event: SelfEnrollmentEventModel): void {
    event.registrationOnEventType = this.REGISTRATION_TYPE_IN_PROCESS;

    this.selfEnrollmentService.enroll(event.eventId).subscribe({
      next: trainingId => this.enrollSuccessHandler(event),
      error: e => this.enrollmentErrorResponseHandler(e, event),
    });
  }

  public enrollSuccessHandler(event: SelfEnrollmentEventModel): void {
    const message: string = this.localization.getLocalTextFromKey('successMessage.enroll');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
    this.updateEvent(event);
  }

  public unenroll(event: SelfEnrollmentEventModel): void {
    event.registrationOnEventType = this.REGISTRATION_TYPE_IN_PROCESS;

    this.selfEnrollmentService.unenroll(event.eventId).subscribe({
      next: trainingId => this.unenrollSuccessHandler(event),
      error: e => this.enrollmentErrorResponseHandler(e, event),
    });
  }

  public unenrollSuccessHandler(event: SelfEnrollmentEventModel): void {
    const message: string = this.localization.getLocalTextFromKey('successMessage.unenroll');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
    this.updateEvent(event);
  }

  public updateEvent(event: SelfEnrollmentEventModel): void {
    this.selfEnrollmentService.updateEvent(event.eventId).subscribe({
      next: updatedEvent => this.updateEventSuccessHandler(event, updatedEvent),
      error: e => this.errorResponseHandler(e),
    });
  }

  public enrollmentErrorResponseHandler(error, event: SelfEnrollmentEventModel): void {
    this.errorResponseHandler(error);
    this.updateEvent(event);
  }

  public updateEventSuccessHandler(oldEvent: SelfEnrollmentEventModel, updatedEvent: SelfEnrollmentEventModel): void {
    if (updatedEvent) {
      Object.assign(oldEvent, updatedEvent);
    } else {
      this.trainingTemplateEventsList.forEach(traininEvents => {
        traininEvents.events = traininEvents.events.filter(e => e !== oldEvent);
      });
    }
  }

  public checkParticipantOnSomeTrainingByTemplate(trainingEvent: TrainingSelfEnrollmentModel): boolean {
    return trainingEvent.events.some(
      event => event.registrationOnEventType.id === RegistrationOnEventType.SELF_ENROLLED,
    );
  }
}
