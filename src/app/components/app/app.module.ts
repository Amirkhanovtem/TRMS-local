import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttachmentInfoTableComponent } from '@attachment-info-table/attachment-info-table.component';
import { AttendedTrainingComponent } from '@attended-training/attended-training.component';
import { PersonIssuedCertificatesComponent } from '@certificate-issue-modals/person-issued-certificates/person-issued-certificates.component';
import { CertificateTemplateSelectionModalComponent } from '@certificate-template-modals/selection/certificate-template-selection-modal/certificate-template-selection-modal.component';
import { CreateUpdateCertificateTemplateModalComponent } from '@certificate-template-modals-create-update/create-update-certificate-template-modal.component';
import { CityComponent } from '@city/city.component';
import { CreateUpdateCityModalComponent } from '@city-modals-create-update/create-update-city-modal.component';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { CommonUploadFileBtnComponent } from '@common-components/common-upload-file-btn/common-upload-file-btn.component';
import { TimePickerComponent } from '@common-components/time-picker/time-picker.component';
import { ConfirmModalComponent } from '@common-confirm-modal/confirm-modal.component';
import { DragOrderModalComponent } from '@common-drag-order-modal/drag-order-modal.component';
import { CommonInputFileComponent } from '@common-input-file/common-input-file.component';
import { SearchComponent } from '@common-search/search.component';
import { CommonTableComponent } from '@common-table/common-table.component';
import { TableSaveVisualComponent } from '@common-table/table-save-visual/table-save-visual.component';
import { TableExportComponent } from '@common-table-table-export/table-export.component';
import { TableFilterColumnComponent } from '@common-table-table-filter-column/table-filter-column.component';
import { TableHideColumnComponent } from '@common-table-table-hide-column/table-hide-column.component';
import { TableResizeColumnComponent } from '@common-table-table-resize-column/table-resize-column.component';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TableWrapperColumnHeaderDirective } from '@common-table-table-wrapper-directives/table-wrapper-column-header.directive';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { DefaultCreateUpdateTreeNodeModalComponent } from '@common-tree-modals-default-create-update/default-create-update-tree-node-modal.component';
import { CommonTreeSelectionModalComponent } from '@common-tree-modals-selection/common-tree-selection-modal.component';
import { TreeNodeBtnsComponent } from '@common-tree-tree-node-btns/tree-node-btns.component';
import { CompanyComponent } from '@company/company.component';
import { CreateUpdateCompanyModalComponent } from '@company-modals-create-update/create-update-company-modal.component';
import { CompleteSyllabusesComponent } from '@complete-syllabuses/complete-syllabuses.component';
import { AppComponent } from '@components/app/app.component';
import { AppRoutingModule } from '@components/app/app-routing.module';
import { OpenAuditTableDirectives } from '@components/audit/audit/directives/open-audit-table.directives';
import { AuditModalComponent } from '@components/audit/audit/modals/audit-modal/audit-modal.component';
import { AuditInfoModalComponent } from '@components/audit/audit-info/modals/audit-info-modal/audit-info-modal.component';
import { OpenUpdateCertificateDirective } from '@components/certificate/certificate/directives/open-update-certificate.directive';
import { CertificateReissueHierarchyTableComponent } from '@components/certificate/certificate/modals/update-certificate-modal/chilt-tables/certificate-reissue-hierarchy-table/certificate-reissue-hierarchy-table.component';
import { UpdateCertificateModalComponent } from '@components/certificate/certificate/modals/update-certificate-modal/update-certificate-modal.component';
import { CertificateHistoryTemplateFilesModalComponent } from '@components/certificate/certificate-history-template-files-modal/certificate-history-template-files-modal.component';
import { CertificateIssueComponent } from '@components/certificate/certificate-issue/certificate-issue.component';
import { CertificateIssueDownloadViewBtnsComponent } from '@components/certificate/certificate-issue/common/certificate-issue-download-view-btns/certificate-issue-download-view-btns.component';
import { DownloadCertificateByParticipantCardIdsComponent } from '@components/certificate/download-certificate-by-participant-card-ids/download-certificate-by-participant-card-ids.component';
import { ReissueCertificateSelectionCertificateComponent } from '@components/certificate/reissue-certificate-modal/modals/reissue-certificate-selection-certificate/reissue-certificate-selection-certificate.component';
import { ReissueCertificateModalComponent } from '@components/certificate/reissue-certificate-modal/reissue-certificate-modal.component';
import { CollapsedModalListComponent } from '@components/collapsed-modal-list/collapsed-modal-list.component';
import { CompleteTrainingsComponent } from '@components/complete-trainings/complete-trainings.component';
import { CertificateTemplateComponent } from '@components/dictionaries/certificate-group/certificate-template/certificate-template.component';
import { CertificateTemplateGroupComponent } from '@components/dictionaries/certificate-group/certificate-template-group/certificate-template-group.component';
import { CertificateTemplateGroupCertificateTemplateTableComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/certificate-template-group-certificate-template-table/certificate-template-group-certificate-template-table.component';
import { CertificateTemplateGroupChildTableComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/child-table/certificate-template-group-child-table/certificate-template-group-child-table.component';
import { CreateUpdateCertificateTemplateGroupModalComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/create-update/create-update-certificate-template-group-modal/create-update-certificate-template-group-modal.component';
import { CreateUpdateTimetableDisplayModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/create-update/create-update-timetable-display-modal/create-update-timetable-display-modal.component';
import { TimetableDisplaySettingsRoomStepComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/steps/timetable-display-settings-room-step/timetable-display-settings-room-step.component';
import { TimetableDisplaySettingsTrainingTemplateStepComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/steps/timetable-display-settings-training-template-step/timetable-display-settings-training-template-step.component';
import { TimetableDisplaySettingsVisualStepComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/steps/timetable-display-settings-visual-step/timetable-display-settings-visual-step.component';
import { TimetableDisplaySettingsModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/timetable-display-settings-modal.component';
import { TimetableDisplayComponent } from '@components/dictionaries/other-group/timetable-display/timetable-display.component';
import { AimsIntegrationInfoComponent } from '@components/integration/aims/aims-integration-info/aims-integration-info.component';
import { AimsIntegrationInfoDetailModalComponent } from '@components/integration/aims/aims-integration-info/modals/aims-integration-info-detail-modal/aims-integration-info-detail-modal.component';
import { HistoricalDataComponent } from '@components/integration/historical-data/historical-data.component';
import { SelfEnrollmentEventsComponent } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/self-enrollment-events.component';
import { SelfEnrollmentFiltersComponent } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-filters/self-enrollment-filters.component';
import { SelfEnrollmentPageComponent } from '@components/self-enrlloment/self-enrollment-page/self-enrollment-page.component';
import { TimetableTvBoardComponent } from '@components/timetable-tv-board/timetable-tv-board.component';
import { TraineeCartDetailTableComponent } from '@components/trainee-cart/childs/trainee-cart-detail-table/trainee-cart-detail-table.component';
import { TraineeCartTrainingTemplateComponent } from '@components/trainee-cart/childs/trainee-cart-training-template/trainee-cart-training-template/trainee-cart-training-template.component';
import { TraineeCartComponent } from '@components/trainee-cart/trainee-cart.component';
import { TrainingSummaryComponent } from '@components/training-summary/training-summary.component';
import { CreateUpdateUnavailabilityResourcesLabelModalComponent } from '@components/unavailability-resources/unavailability-resources-label/modals/create-update/create-update-unavailability-resources-label-modal/create-update-unavailability-resources-label-modal.component';
import { UnavailabilityResourcesLabelComponent } from '@components/unavailability-resources/unavailability-resources-label/unavailability-resources-label.component';
import { CreateUpdateUnavailabilityResourcePeriodComponent } from '@components/unavailability-resources/unavailability-resources-period/modals/create-update/create-update-unavailability-resource-period/create-update-unavailability-resource-period.component';
import { UnavailabilityResourcesPeriodComponent } from '@components/unavailability-resources/unavailability-resources-period/unavailability-resources-period.component';
import { CostCenterComponent } from '@cost-center/cost-center.component';
import { CreateUpdateCostCenterModalComponent } from '@cost-center-modals-create-update/create-update-cost-center-modal.component';
import { CrudBtnsComponent } from '@dictionaries-common-crud-btns/crud-btns.component';
import { AllowNumbersOnlyDirective } from '@directives/allow-numbers-only.directive';
import { AllowOnlyNumberStepHalfPointDirective } from '@directives/allow-only-number-step-half-point.directive';
import { EquipmentComponent } from '@equipment/equipment.component';
import { EquipmentCategoryComponent } from '@equipment-category/equipment-category.component';
import { CreateUpdateEquipmentCategoryModalComponent } from '@equipment-category-modals-create-update/create-update-equipment-category-modal.component';
import { EquipmentChildTableComponent } from '@equipment-modals-child-table/equipment-child-table.component';
import { CreateUpdateEquipmentModalComponent } from '@equipment-modals-create-update/create-update-equipment-modal.component';
import { EmployeeProfilePrototypeComponent } from '@components/employee-profile-prototype/employee-profile-prototype.component';
import { FeedbackPrototypeComponent } from '@components/feedback-prototype/feedback-prototype.component';
import { LmsCertificatesPrototypeComponent } from '@components/lms-certificates-prototype/lms-certificates-prototype.component';
import { LmsPrototypeComponent } from '@components/lms-prototype/lms-prototype.component';
import { ManagerProfilePrototypeComponent } from '@components/manager-profile-prototype/manager-profile-prototype.component';
import { PlannerRequestsPrototypeComponent } from '@components/planner-requests-prototype/planner-requests-prototype.component';
import { RequestsPrototypeComponent } from '@components/requests-prototype/requests-prototype.component';
import { CreatingEventEquipmentTableComponent } from '@event-components/general-child-table/equipment/creating-event-equipment-table.component';
import { CreatingEventLinearTrainerTableComponent } from '@event-components/general-child-table/linear-trainer/creating-event-linear-trainer-table.component';
import { CreatingEventMainTrainerTableComponent } from '@event-components/general-child-table/main-trainer/creating-event-main-trainer-table.component';
import { CreatingEventPersonTableComponent } from '@event-components/general-child-table/person/creating-event-person-table.component';
import { CreatingEventRoomTableComponent } from '@event-components/general-child-table/room/creating-event-room-table.component';
import { CreatingNewEventModalComponent } from '@event-modals-create/creating-new-event-modal.component';
import { EventCreateErrorsTableModalComponent } from '@event-modals-create-errors-table/event-create-errors-table-modal.component';
import { CreateUpdateModuleModalComponent } from '@event-module-modals-create-update/create-update-module-modal.component';
import { ModulePersonTrainerStepComponent } from '@event-module-modals-create-update-person-trainer-step/module-person-trainer-step.component';
import { ModuleResourceStepComponent } from '@event-module-modals-create-update-resource-step/module-resource-step.component';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { SyllabusPersonTrainerStepComponent } from '@event-syllabus-modals-create-update-person-trainer-step/syllabus-person-trainer-step.component';
import { SyllabusResourceStepComponent } from '@event-syllabus-modals-create-update-resource-step/syllabus-resource-step.component';
import { SyllabusTrainingTableComponent } from '@event-syllabus-modals-training-table/syllabus-training-table.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { TrainingPersonTrainerStepComponent } from '@event-training-modals-create-update-person-trainer-step/training-person-trainer-step.component';
import { TrainingResourceStepComponent } from '@event-training-modals-create-update-resource-step/training-resource-step.component';
import { TrainingModuleTableComponent } from '@event-training-modals-training-module-table/training-module-table.component';
import { ExamResultsComponent } from '@exam-result/exam-results.component';
import { CreateUpdateExamResultComponent } from '@exam-result-modals-create-update/create-update-exam-result.component';
import { ExamTemplateComponent } from '@exam-template/exam-template.component';
import { CreateUpdateExamTemplateModalComponent } from '@exam-template-modals-create-update/create-update-exam-template-modal.component';
import { ExamTemplateTrainingTemplateTableComponent } from '@exam-template-modals-training-template-table/exam-template-training-template-table.component';
import { GanttComponent } from '@gantt/gantt.component';
import { SelectionDraftModalComponent } from '@gantt-modals-draft-selection/selection-draft-modal.component';
import { GanttFilterSelectionComponent } from '@gantt-modals-filter-selection/gantt-filter-selection.component';
import { GanttEventTooltipComponent } from '@gantt-modals-tolltips-event/gantt-event-tooltip.component';
import { GanttResourceTooltipComponent } from '@gantt-modals-tolltips-resource/gantt-resource-tooltip.component';
import { GanttViewSelectionModalComponent } from '@gantt-modals-view-selection/gantt-view-selection-modal.component';
import { RedirectGuard } from '@guards/redirect-guard';
import { TvBoardGuard } from '@guards/tv-board-guard';
import { HistoricalDataUploadModalComponent } from '@historical-data-modals-upload/historical-data-upload-modal.component';
import { HistoricalDataUploadInfoModalComponent } from '@historical-data-modals-upload-info/historical-data-upload-info-modal.component';
import { HomeComponent } from '@home/home.component';
import { AuthorizeInterceptor } from '@interceptors/auth-interceptor';
import { LoadPageComponent } from '@load-page/load-page.component';
import { Localization } from '@localization/localization';
import { LocationComponent } from '@location/location.component';
import { CreateUpdateLocationModalComponent } from '@location-modals-create-update/create-update-location-modal.component';
import { MaterialModule } from '@material/material.module';
import { CreateUpdateModuleTemplateComponent } from '@module-template-modals-create-update/create-update-module-template.component';
import { LanguageModule } from '@modules/language.module';
import { NavbarComponent } from '@navbar/navbar.component';
import { NavbuttonComponent } from '@navbutton/navbutton.component';
import { NewReleaseComponent } from '@components/new-release/new-release.component';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxMomentDatetimeModule, provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { TranslocoService } from '@ngneat/transloco';
import { SentNotificationComponent } from '@notification-sent/sent-notification.component';
import { SentByTargetNotificationModalComponent } from '@notification-sent-modals-by-target-notification/sent-by-target-notification-modal.component';
import { SentNotificationSelectionTableComponent } from '@notification-sent-selection/sent-notification-selection-table.component';
import { BodyViewModalComponent } from '@notification-sent-selection-modals-body-view/body-view-modal.component';
import { TargetListComponent } from '@notification-target-modals-list/target-list.component';
import { TargetNotificationTemplateModalComponent } from '@notification-target-modals-notification-template/target-notification-template-modal.component';
import { NotificationTemplateComponent } from '@notification-template/notification-template.component';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateEditorStepComponent } from '@notification-template-modals-create-update-steps-editor/notification-template-editor-step.component';
import { NotificationTemplateGeneralSettingsStepComponent } from '@notification-template-modals-create-update-steps-general-settings/notification-template-general-settings-step.component';
import { NotificationTemplateTargetAudienceStepComponent } from '@notification-template-modals-create-update-steps-target-audience/notification-template-target-audience-step.component';
import { AdditionalTargetAudienceEmailComponent } from '@notification-template-modals-create-update-steps-target-audience-add-email/additional-target-audience-email.component';
import { AdditionalTargetEmailTableComponent } from '@notification-template-modals-create-update-steps-target-audience-add-target-email-table/additional-target-email-table.component';
import { NotificationTemplateTargetObjectStepComponent } from '@notification-template-modals-create-update-steps-target-object/notification-template-target-object-step.component';
import { SelectSyllabusComponent } from '@notification-template-modals-create-update-steps-target-object-select-syllabus/select-syllabus.component';
import { SelectTrainingComponent } from '@notification-template-modals-create-update-steps-target-object-select-training/select-training.component';
import { NotificationTemplateTimeStepComponent } from '@notification-template-modals-create-update-steps-time/notification-template-time-step.component';
import { NeedRepeatSettingsComponent } from '@notification-template-modals-create-update-steps-time-need-repeat-settings/need-repeat-settings.component';
import { NotificationTemplateSelectionTableComponent } from '@notification-template-modals-selection/notification-template-selection-table.component';
import { NotificationTemplateModalComponent } from '@notification-template-modals-view/notification-template-modal.component';
import { ParticipationCardComponent } from '@participation-card/participation-card.component';
import { GenerateCertificateOptionsModalComponent } from '@participation-card-modals/generate-certificate-options-modal/generate-certificate-options-modal.component';
import { GenerateParticipationSheetModalComponent } from '@participation-card-modals-generate-participation-sheet/generate-participation-sheet-modal.component';
import { TrainingNotesComponent } from '@participation-card-modals-training-notes/training-notes.component';
import { CreateUpdateTrainingNotesModalComponent } from '@participation-card-modals-training-notes-modals-create-update/create-update-training-notes-modal.component';
import { PersonHierarchyFilterComponent } from '@person/components/person-table-with-hierarchy-filter/childs/person-hierarchy-filter/person-hierarchy-filter.component';
import { PersonTableWithHierarchyFilterComponent } from '@person/components/person-table-with-hierarchy-filter/person-table-with-hierarchy-filter.component';
import { PersonComponent } from '@person/person.component';
import { PersonFioPipe } from '@person/pipes/person-fio.pipe';
import { CreateUpdatePersonModalComponent } from '@person-modals-create-update/create-update-person-modal.component';
import { PersonFullNameInfoTableComponent } from '@person-modals-full-name-info-table/person-full-name-info-table.component';
import { SelectPersonsByPersonalNumberModalComponent } from '@person-modals-select-persons-by-personal-number/select-persons-by-personal-number-modal.component';
import { PersonSelectionModalComponent } from '@person-modals-selection/person-selection-modal.component';
import { PadPipe } from '@pipes/pad.pipe';
import { RoomAddressPipe } from '@pipes/room-address.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { PositionComponent } from '@position/position.component';
import { CreateUpdatePositionModalComponent } from '@position-modals-create-update/create-update-position-modal.component';
import { ProfileComponent } from '@profile/profile.component';
import { ProfilePageComponent } from '@profile/profile-page/profile-page.component';
import { PersonTrainingTableComponent } from '@profile-child-tables-person-training/person-training-table.component';
import { FullProfileComponent } from '@profile-full/full-profile.component';
import { RoomComponent } from '@room/room.component';
import { CreateUpdateRoomModalComponent } from '@room-modals-create-update/create-update-room-modal.component';
import { RoomSelectionModalComponent } from '@room-modals-selection/room-selection-modal.component';
import { InactivityService } from '@services/inactivity.service';
import { LanguageService } from '@services/language.service';
import { ServiceModeService } from '@services/service-mode.service';
import { SubdivisionComponent } from '@subdivision/subdivision.component';
import { SyllabusTemplateComponent } from '@syllabus-template/syllabus-template.component';
import { CreateUpdateSyllabusTemplateComponent } from '@syllabus-template-modals-create-update/create-update-syllabus-template.component';
import { SyllabusTemplateTrainingTemplateTableComponent } from '@syllabus-template-modals-training-template-table/syllabus-template-training-template-table.component';
import { TagRoleComponent } from '@tag-role/tag-role.component';
import { CreateUpdateTagRoleModalComponent } from '@tag-role-modals/create-update/create-update-tag-role-modal.component';
import { TrainerComponent } from '@trainer/trainer.component';
import { TrainerCategoryComponent } from '@trainer-category/trainer-category.component';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';
import { TrainerTrainingTableComponent } from '@trainer-modals-create-update-child-tables-trainer-training-table/trainer-training-table.component';
import { LinearOrMainTrainerSelectionModalComponent } from '@trainer-modals-selection/linear-or-main-trainer-selection-modal.component';
import { TrainingCategoryComponent } from '@training-category/training-category.component';
import { TrainingTemplateCertificateTemplatesPipe } from '@training-template/pipes/training-template-certificate-templates.pipe';
import { TrainingTemplateComponent } from '@training-template/training-template.component';
import { TrainingTemplateCertificateTemplateHistoryModalComponent } from '@training-template-modals/training-template-certificate-template-history-modal/training-template-certificate-template-history-modal.component';
import { CreateUpdateTrainingTemplateModalComponent } from '@training-template-modals-create-update/create-update-training-template-modal.component';
import { TrainingTemplateModuleTemplateTableComponent } from '@training-template-modals-module-template-table/training-template-module-template-table.component';
import { TrainingTemplateSelectionModalComponent } from '@training-template-modals-selection/training-template-selection-modal.component';
import { TrainingTemplateSyllabusTemplateTableComponent } from '@training-template-modals-syllabus-template-table/training-template-syllabus-template-table.component';
import { TrainingTypeComponent } from '@training-type/training-type.component';
import { CreateUpdateTrainingTypeModalComponent } from '@training-type-modals-create-update/create-update-training-type-modal.component';
import { deleteCookie, getCookie } from '@utils/cookies';
import { CitModule } from 'cit-angular';
import { JoditAngularModule } from 'jodit-angular';
import { jwtDecode } from 'jwt-decode';
import { KeycloakAngularModule, KeycloakEvent, KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { ToastrModule } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CustomMomentDateAdapter } from '../../adapters/custom-moment-date-adapter';
import { DEFAULT_LANGUAGE } from '../../core/models/languages.enum';

export function initializeKeycloak(
  keycloakService: KeycloakService,
  translocoService: TranslocoService,
  languageService: LanguageService,
  serviceModeService: ServiceModeService,
  inactivityService: InactivityService,
): () => Promise<void> {
  return (): Promise<void> => {
    const env = environment.envVar;
    return new Promise((resolve, reject) => {
      const token = getCookie('access_token');
      const language = getCookie('language');
      const languageFromKeycloakKey = 'languageFromKeycloak';

      const initKeycloak = async () => {
        try {
          const activeLang = languageService.getSavedLang() || DEFAULT_LANGUAGE;
          languageService.setActiveLang(activeLang);
          await firstValueFrom(translocoService.load(activeLang));

          console.log('Initializing Keycloak', token ? 'with token from cookie' : 'without token from cookie');
          if (token) {
            await keycloakService.init({
              config: {
                url: env.keycloakUrl,
                realm: env.realm,
                clientId: env.clientId,
              },
              loadUserProfileAtStartUp: false,
              initOptions: {
                checkLoginIframe: false,
              },
              enableBearerInterceptor: true,
              bearerExcludedUrls: ['/assets', '/clients/public'],
            });

            const keycloak = keycloakService.getKeycloakInstance();
            keycloak.token = token;
            keycloak.authenticated = true;
            keycloak.tokenParsed = jwtDecode(token);

            if (language && language !== activeLang) {
              languageService.setActiveLang(language);
            }

            deleteCookie('access_token');
            deleteCookie('language');

            await serviceModeService.loadServiceMode();
            resolve();
            return;
          }

          const subscription = keycloakService.keycloakEvents$.subscribe(async (event: KeycloakEvent) => {
            if (
              ![KeycloakEventType.OnAuthSuccess, KeycloakEventType.OnReady].some(
                eventType => event.type === eventType,
              ) ||
              (event.type === KeycloakEventType.OnReady && !event.args)
            ) {
              if (window.IS_KC_APP_ROUTE) {
                window.location.href = '/404';
                subscription.unsubscribe();
                return;
              }

              localStorage.setItem(languageFromKeycloakKey, 'true');
              keycloakService
                .getKeycloakInstance()
                .login(<KeycloakLoginOptions>{
                  locale: translocoService.getActiveLang(),
                })
                .then(() => {
                  resolve();
                  subscription.unsubscribe();
                });
            } else {
              if (localStorage.getItem(languageFromKeycloakKey)) {
                localStorage.removeItem(languageFromKeycloakKey);
                keycloakService
                  .getKeycloakInstance()
                  .loadUserInfo()
                  .then(res => {
                    const locale = (res as any).locale;

                    if (locale && locale !== activeLang) {
                      languageService.setActiveLang(locale);
                    }

                    resolve();
                    subscription.unsubscribe();
                  });
              } else {
                resolve();
                subscription.unsubscribe();
              }
            }
            inactivityService.checkInactivitySession();
          });

          await keycloakService.init({
            config: {
              url: env.keycloakUrl,
              realm: env.realm,
              clientId: env.clientId,
            },
            loadUserProfileAtStartUp: true,
            initOptions: {
              onLoad: 'check-sso',
              flow: 'standard',
              checkLoginIframe: false,
              checkLoginIframeInterval: 1,
            },
            enableBearerInterceptor: true,
            bearerExcludedUrls: ['/assets', '/clients/public'],
          });

          await serviceModeService.loadServiceMode();
          inactivityService.initializeInactivityTimeout();
        } catch (error) {
          reject(error);
        }
      };

      setTimeout(() => initKeycloak(), 50);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbuttonComponent,
    NewReleaseComponent,
    EmployeeProfilePrototypeComponent,
    ManagerProfilePrototypeComponent,
    RequestsPrototypeComponent,
    PlannerRequestsPrototypeComponent,
    LmsPrototypeComponent,
    LmsCertificatesPrototypeComponent,
    FeedbackPrototypeComponent,
    HomeComponent,
    LoadPageComponent,
    ProfileComponent,
    FullProfileComponent,
    ProfilePageComponent,
    EquipmentComponent,
    CreateUpdateEquipmentModalComponent,
    RoomComponent,
    CreateUpdateRoomModalComponent,
    LocationComponent,
    CreateUpdateLocationModalComponent,
    PersonComponent,
    CreateUpdatePersonModalComponent,
    CertificateTemplateComponent,
    CreateUpdateCertificateTemplateModalComponent,
    ExamTemplateComponent,
    CreateUpdateExamTemplateModalComponent,
    TrainingTypeComponent,
    CreateUpdateTrainingTypeModalComponent,
    TrainingCategoryComponent,
    TrainerComponent,
    CreateUpdateTrainerModalComponent,
    TrainingTemplateComponent,
    CreateUpdateTrainingTemplateModalComponent,
    TrainingTemplateModuleTemplateTableComponent,
    CreateUpdateModuleTemplateComponent,
    SyllabusTemplateComponent,
    CreateUpdateSyllabusTemplateComponent,
    SyllabusTemplateTrainingTemplateTableComponent,
    TrainingTemplateSelectionModalComponent,
    EquipmentCategoryComponent,
    CreateUpdateEquipmentCategoryModalComponent,
    EquipmentChildTableComponent,
    CityComponent,
    CreateUpdateCityModalComponent,
    CompanyComponent,
    CreateUpdateCompanyModalComponent,
    PositionComponent,
    CreateUpdatePositionModalComponent,
    CostCenterComponent,
    CreateUpdateCostCenterModalComponent,
    TrainerCategoryComponent,
    SubdivisionComponent,
    CertificateTemplateGroupComponent,
    CreateUpdateCertificateTemplateGroupModalComponent,
    CertificateTemplateGroupCertificateTemplateTableComponent,
    CertificateTemplateSelectionModalComponent,
    CertificateTemplateGroupChildTableComponent,
    TimetableDisplayComponent,
    CreateUpdateTimetableDisplayModalComponent,
    CrudBtnsComponent,
    CreatingNewEventModalComponent,
    CreateUpdateSyllabusModalComponent,
    SyllabusTrainingTableComponent,
    CreatingEventPersonTableComponent,
    PersonSelectionModalComponent,
    CreateUpdateTrainingModalComponent,
    CreatingEventLinearTrainerTableComponent,
    LinearOrMainTrainerSelectionModalComponent,
    TrainingModuleTableComponent,
    CreateUpdateModuleModalComponent,
    CreatingEventEquipmentTableComponent,
    CreatingEventRoomTableComponent,
    RoomSelectionModalComponent,
    CreatingEventMainTrainerTableComponent,
    SnackbarInfoComponent,
    EventCreateErrorsTableModalComponent,
    SyllabusPersonTrainerStepComponent,
    SyllabusResourceStepComponent,
    TrainingResourceStepComponent,
    TrainingPersonTrainerStepComponent,
    ModuleResourceStepComponent,
    ModulePersonTrainerStepComponent,
    ParticipationCardComponent,
    ExamResultsComponent,
    CreateUpdateExamResultComponent,
    CompleteTrainingsComponent,
    CompleteSyllabusesComponent,
    AttendedTrainingComponent,
    GenerateParticipationSheetModalComponent,
    TrainingNotesComponent,
    CreateUpdateTrainingNotesModalComponent,
    GenerateCertificateOptionsModalComponent,
    CertificateIssueComponent,
    PersonIssuedCertificatesComponent,
    TrainingTemplateCertificateTemplateHistoryModalComponent,
    ReissueCertificateModalComponent,
    ReissueCertificateSelectionCertificateComponent,
    CertificateHistoryTemplateFilesModalComponent,
    CertificateIssueDownloadViewBtnsComponent,
    UpdateCertificateModalComponent,
    CertificateReissueHierarchyTableComponent,
    DownloadCertificateByParticipantCardIdsComponent,
    CommonTreeComponent,
    TreeNodeBtnsComponent,
    DefaultCreateUpdateTreeNodeModalComponent,
    CommonTreeSelectionModalComponent,
    CommonTableComponent,
    TimePickerComponent,
    TableHideColumnComponent,
    TableWrapperComponent,
    TableExportComponent,
    TableFilterColumnComponent,
    TableSaveVisualComponent,
    TableResizeColumnComponent,
    AttachmentInfoTableComponent,
    SearchComponent,
    ConfirmModalComponent,
    DragOrderModalComponent,
    CommonInputFileComponent,
    CommonComponent,
    CommonUploadFileBtnComponent,
    CommonModalComponent,
    CollapsedModalListComponent,
    NotificationTemplateComponent,
    CreateUpdateNotificationTemplateModalComponent,
    NotificationTemplateGeneralSettingsStepComponent,
    NotificationTemplateTargetAudienceStepComponent,
    AdditionalTargetEmailTableComponent,
    NotificationTemplateTimeStepComponent,
    NotificationTemplateEditorStepComponent,
    NeedRepeatSettingsComponent,
    AdditionalTargetAudienceEmailComponent,
    NotificationTemplateTargetObjectStepComponent,
    SelectTrainingComponent,
    SelectSyllabusComponent,
    NotificationTemplateSelectionTableComponent,
    TargetNotificationTemplateModalComponent,
    TargetListComponent,
    SentNotificationSelectionTableComponent,
    SentNotificationComponent,
    BodyViewModalComponent,
    SentByTargetNotificationModalComponent,
    NotificationTemplateModalComponent,
    GanttComponent,
    GanttEventTooltipComponent,
    GanttResourceTooltipComponent,
    SelectionDraftModalComponent,
    GanttFilterSelectionComponent,
    GanttViewSelectionModalComponent,
    HistoricalDataComponent,
    HistoricalDataUploadModalComponent,
    HistoricalDataUploadInfoModalComponent,
    AimsIntegrationInfoComponent,
    AimsIntegrationInfoDetailModalComponent,
    UnavailabilityResourcesLabelComponent,
    CreateUpdateUnavailabilityResourcesLabelModalComponent,
    UnavailabilityResourcesPeriodComponent,
    CreateUpdateUnavailabilityResourcePeriodComponent,
    AuditModalComponent,
    AuditInfoModalComponent,
    TraineeCartComponent,
    TraineeCartTrainingTemplateComponent,
    TraineeCartDetailTableComponent,
    TimetableDisplaySettingsModalComponent,
    TimetableDisplaySettingsRoomStepComponent,
    TimetableDisplaySettingsTrainingTemplateStepComponent,
    TimetableDisplaySettingsVisualStepComponent,
    TimetableTvBoardComponent,
    SelfEnrollmentPageComponent,
    SelfEnrollmentFiltersComponent,
    SelfEnrollmentEventsComponent,
    TrainingTemplateSyllabusTemplateTableComponent,
    ExamTemplateTrainingTemplateTableComponent,
    PersonFullNameInfoTableComponent,
    SelectPersonsByPersonalNumberModalComponent,
    PersonTrainingTableComponent,
    TrainerTrainingTableComponent,
    TrainingSummaryComponent,
    AllowNumbersOnlyDirective,
    AllowOnlyNumberStepHalfPointDirective,
    TableWrapperColumnDirective,
    TableWrapperColumnHeaderDirective,
    OpenAuditTableDirectives,
    OpenUpdateCertificateDirective,
    SafeHtmlPipe,
    PersonFioPipe,
    RoomAddressPipe,
    PadPipe,
    TrainingTemplateCertificateTemplatesPipe,
    TagRoleComponent,
    CreateUpdateTagRoleModalComponent,
    PersonTableWithHierarchyFilterComponent,
    PersonHierarchyFilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    LanguageModule,
    KeycloakAngularModule,
    JoditAngularModule,
    CitModule,
    ToastrModule.forRoot({
      maxOpened: 5,
      autoDismiss: true,
    }),
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    MtxMomentDatetimeModule,
  ],
  providers: [
    TvBoardGuard,
    RedirectGuard,
    Localization,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    provideMomentDatetimeAdapter({
      parse: {
        dateInput: 'DD.MM.YYYY',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'DD.MM.YYYY HH:mm',
      },
      display: {
        dateInput: 'DD.MM.YYYY',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'DD.MM.YYYY HH:mm',
        monthYearLabel: 'YYYY MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'MMM DD, ddd',
      },
    }),
    {
      provide: DateAdapter,
      useClass: CustomMomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: Localization.DEFAULT_LANG,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },

    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, TranslocoService, LanguageService, ServiceModeService, InactivityService],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
