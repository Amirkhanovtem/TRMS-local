import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SelfEnrollmentEventsComponent } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/self-enrollment-events.component';
import { SelfEnrollmentFilterModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-filters/models/self-enrollment-filter.model';
import { ResponsiveService } from '@services/responsive.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-self-enrollment-page',
  templateUrl: './self-enrollment-page.component.html',
  styleUrls: ['./self-enrollment-page.component.scss'],
  standalone: false,
})
export class SelfEnrollmentPageComponent extends CommonComponent implements OnDestroy, OnInit {
  @ViewChild(SelfEnrollmentEventsComponent) eventsComponent: SelfEnrollmentEventsComponent;
  public showFilters: boolean = true;
  public showEvents: boolean = false;
  public isMobileView: boolean = false;
  public appliedFilters: SelfEnrollmentFilterModel;
  private mobileSubscription: Subscription;

  constructor(
    private responsiveService: ResponsiveService,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.mobileSubscription = this.responsiveService.isMobile$.subscribe(isMobile => {
      this.isMobileView = isMobile;

      if (!isMobile) {
        this.showFilters = true;
        this.showEvents = true;
      } else {
        // On mobile, show filters initially, events only after applying filters
        if (this.showEvents) {
          this.showFilters = false;
        } else {
          this.showFilters = true;
          this.showEvents = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.mobileSubscription) {
      this.mobileSubscription.unsubscribe();
    }
  }

  public applyFilters(filters: SelfEnrollmentFilterModel): void {
    this.appliedFilters = filters;
    this.eventsComponent.loadEventsByFilter(filters);

    if (this.isMobileView) {
      this.showFilters = false;
      this.showEvents = true;
    }
  }

  public backToFilters(): void {
    if (this.isMobileView) {
      this.showFilters = true;
      this.showEvents = false;
    }
  }
}
