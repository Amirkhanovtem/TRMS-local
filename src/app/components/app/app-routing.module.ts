import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from '@city/city.component';
import { CompanyComponent } from '@company/company.component';
import { CompleteSyllabusesComponent } from '@complete-syllabuses/complete-syllabuses.component';
import { CertificateIssueComponent } from '@components/certificate/certificate-issue/certificate-issue.component';
import { CompleteTrainingsComponent } from '@components/complete-trainings/complete-trainings.component';
import { CertificateTemplateComponent } from '@components/dictionaries/certificate-group/certificate-template/certificate-template.component';
import { CertificateTemplateGroupComponent } from '@components/dictionaries/certificate-group/certificate-template-group/certificate-template-group.component';
import { TimetableDisplayComponent } from '@components/dictionaries/other-group/timetable-display/timetable-display.component';
import { AimsIntegrationInfoComponent } from '@components/integration/aims/aims-integration-info/aims-integration-info.component';
import { ProfilePageComponent } from '@components/profile/profile-page/profile-page.component';
import { SelfEnrollmentPageComponent } from '@components/self-enrlloment/self-enrollment-page/self-enrollment-page.component';
import { TagPersonLinkerComponent } from '@components/tag/tag-person-linker/tag-person-linker.component';
import { TagResourceLinkerComponent } from '@components/tag/tag-resource-linker/tag-resource-linker.component';
import { TimetableTvBoardComponent } from '@components/timetable-tv-board/timetable-tv-board.component';
import { TraineeCartComponent } from '@components/trainee-cart/trainee-cart.component';
import { TrainingSummaryComponent } from '@components/training-summary/training-summary.component';
import { UnavailabilityResourcesLabelComponent } from '@components/unavailability-resources/unavailability-resources-label/unavailability-resources-label.component';
import { UnavailabilityResourcesPeriodComponent } from '@components/unavailability-resources/unavailability-resources-period/unavailability-resources-period.component';
import { CostCenterComponent } from '@cost-center/cost-center.component';
import { EquipmentComponent } from '@equipment/equipment.component';
import { EquipmentCategoryComponent } from '@equipment-category/equipment-category.component';
import { EmployeeProfilePrototypeComponent } from '@components/employee-profile-prototype/employee-profile-prototype.component';
import { ExamTemplateComponent } from '@exam-template/exam-template.component';
import { FeedbackPrototypeComponent } from '@components/feedback-prototype/feedback-prototype.component';
import { GanttComponent } from '@gantt/gantt.component';
import { RedirectGuard } from '@guards/redirect-guard';
import { TvBoardGuard } from '@guards/tv-board-guard';
import { HistoricalDataComponent } from '@historical-data/historical-data.component';
import { HomeComponent } from '@home/home.component';
import { LocationComponent } from '@location/location.component';
import { LmsCertificatesPrototypeComponent } from '@components/lms-certificates-prototype/lms-certificates-prototype.component';
import { LmsPrototypeComponent } from '@components/lms-prototype/lms-prototype.component';
import { NewReleaseComponent } from '@components/new-release/new-release.component';
import { ManagerProfilePrototypeComponent } from '@components/manager-profile-prototype/manager-profile-prototype.component';
import { PlannerRequestsPrototypeComponent } from '@components/planner-requests-prototype/planner-requests-prototype.component';
import { RequestsPrototypeComponent } from '@components/requests-prototype/requests-prototype.component';
import { SentNotificationComponent } from '@notification-sent/sent-notification.component';
import { NotificationTemplateComponent } from '@notification-template/notification-template.component';
import { PersonComponent } from '@person/person.component';
import { PositionComponent } from '@position/position.component';
import { RoomComponent } from '@room/room.component';
import { SubdivisionComponent } from '@subdivision/subdivision.component';
import { SyllabusTemplateComponent } from '@syllabus-template/syllabus-template.component';
import { TagRoleComponent } from '@tag-role/tag-role.component';
import { TrainerComponent } from '@trainer/trainer.component';
import { TrainerCategoryComponent } from '@trainer-category/trainer-category.component';
import { TrainingCategoryComponent } from '@training-category/training-category.component';
import { TrainingTemplateComponent } from '@training-template/training-template.component';
import { TrainingTypeComponent } from '@training-type/training-type.component';

const routes: Routes = [
  {
    path: 'tv-board',
    component: TimetableTvBoardComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [TvBoardGuard],
    canActivateChild: [TvBoardGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [RedirectGuard],
      },
      {
        path: 'gant',
        children: [
          {
            path: '',
            component: GanttComponent,
          },
          {
            path: 'training/:trainingSessionCode',
            pathMatch: 'full',
            component: GanttComponent,
          },
        ],
      },
      {
        path: 'equipment',
        component: EquipmentComponent,
      },
      {
        path: 'equipment-categories',
        component: EquipmentCategoryComponent,
      },
      {
        path: 'room',
        component: RoomComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'person',
        component: PersonComponent,
      },
      {
        path: 'certificate-template',
        component: CertificateTemplateComponent,
      },
      {
        path: 'certificate-template-group',
        component: CertificateTemplateGroupComponent,
      },
      {
        path: 'certificate-issue',
        component: CertificateIssueComponent,
      },
      {
        path: 'exam-template',
        component: ExamTemplateComponent,
      },
      {
        path: 'training-type',
        component: TrainingTypeComponent,
      },
      {
        path: 'training-category',
        component: TrainingCategoryComponent,
      },
      {
        path: 'training-template',
        component: TrainingTemplateComponent,
      },
      {
        path: 'trainer',
        component: TrainerComponent,
      },
      {
        path: 'syllabus-template',
        component: SyllabusTemplateComponent,
      },
      {
        path: 'completed-syllabuses',
        component: CompleteSyllabusesComponent,
      },
      {
        path: 'completed-trainings',
        component: CompleteTrainingsComponent,
      },
      {
        path: 'city',
        component: CityComponent,
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'position',
        component: PositionComponent,
      },
      {
        path: 'cost-center',
        component: CostCenterComponent,
      },
      {
        path: 'trainer-category',
        component: TrainerCategoryComponent,
      },
      {
        path: 'subdivision',
        component: SubdivisionComponent,
      },
      {
        path: 'notification-template',
        component: NotificationTemplateComponent,
      },
      {
        path: 'sent-notification',
        component: SentNotificationComponent,
      },
      {
        path: 'historical-data',
        component: HistoricalDataComponent,
      },
      {
        path: 'aims-integration-info',
        component: AimsIntegrationInfoComponent,
      },
      {
        path: 'training-summary-report',
        component: TrainingSummaryComponent,
      },
      {
        path: 'unavailability-resources-label',
        component: UnavailabilityResourcesLabelComponent,
      },
      {
        path: 'unavailability-resources-period',
        component: UnavailabilityResourcesPeriodComponent,
      },
      {
        path: 'trainee-cart',
        component: TraineeCartComponent,
      },
      {
        path: 'timetable-display',
        component: TimetableDisplayComponent,
      },
      {
        path: 'self-enrollment',
        component: SelfEnrollmentPageComponent,
      },
      {
        path: 'profile-page',
        component: ProfilePageComponent,
      },
      {
        path: 'new',
        component: NewReleaseComponent,
      },
      {
        path: 'employee-profile-prototype',
        component: EmployeeProfilePrototypeComponent,
      },
      {
        path: 'manager-profile-prototype',
        component: ManagerProfilePrototypeComponent,
      },
      {
        path: 'requests-prototype',
        component: RequestsPrototypeComponent,
      },
      {
        path: 'planner-requests-prototype',
        component: PlannerRequestsPrototypeComponent,
      },
      {
        path: 'lms-prototype',
        component: LmsPrototypeComponent,
      },
      {
        path: 'lms-certificates-prototype',
        component: LmsCertificatesPrototypeComponent,
      },
      {
        path: 'feedback-prototype',
        component: FeedbackPrototypeComponent,
      },
      {
        path: 'tag-role',
        component: TagRoleComponent,
      },
      {
        path: 'tag-person-linker',
        component: TagPersonLinkerComponent,
      },
      {
        path: 'tag-resource-linker',
        component: TagResourceLinkerComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
