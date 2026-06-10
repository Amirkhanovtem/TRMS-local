import { Component, Injector, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { TrainingSummaryService } from '@components/training-summary/services/training-summary.service';
import { PersonTrainingModel } from '@profile-child-tables-person-training-models/person-training.model';

@Component({
  selector: 'app-person-training-table',
  templateUrl: './person-training-table.component.html',
  styleUrls: ['./person-training-table.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class PersonTrainingTableComponent extends CommonComponent {
  @Input() personId: string;

  public trainings: Array<PersonTrainingModel> = [];
  public filteredTrainings: Array<PersonTrainingModel> = [];
  public groupedTrainings: Map<number, Array<PersonTrainingModel>> = new Map();
  public collapsedYears: Set<number> = new Set();
  public isLoading: boolean = false;

  // Filters
  public statusFilter: string = 'all';
  public certificateFilter: boolean = false;
  public trainingNameFilter: string = '';
  public availableTrainingNames: Array<string> = [];

  constructor(
    injector: Injector,
    private trainingSummaryService: TrainingSummaryService,
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.loadPersonTrainingTable();
  }

  public loadPersonTrainingTable(): void {
    if (!this.personId) {
      return;
    }

    this.isLoading = true;
    this.trainingSummaryService.getTrainingsSummaryByPersonId(this.personId).subscribe({
      next: data => {
        this.trainings = data || [];
        this.extractAvailableTrainingNames();
        this.applyFilters();
        this.isLoading = false;
      },
      error: e => {
        this.errorResponseHandler(e);
        this.isLoading = false;
      },
    });
  }

  private extractAvailableTrainingNames(): void {
    const names = new Set(this.trainings.map(t => t.trainingTemplateName));
    this.availableTrainingNames = Array.from(names).sort();
  }

  public applyFilters(): void {
    let filtered = [...this.trainings];

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(t => t.trainingFactualStatus?.id === this.statusFilter);
    }

    // Certificate filter
    if (this.certificateFilter) {
      filtered = filtered.filter(t => t.certificate);
    }

    // Training name filter
    if (this.trainingNameFilter) {
      filtered = filtered.filter(t => t.trainingTemplateName === this.trainingNameFilter);
    }

    this.filteredTrainings = filtered;
    this.groupTrainingsByYear();
  }

  private groupTrainingsByYear(): void {
    this.groupedTrainings.clear();

    this.filteredTrainings.forEach(training => {
      const year = new Date(training.startDateTraining).getFullYear();
      if (!this.groupedTrainings.has(year)) {
        this.groupedTrainings.set(year, []);
      }
      this.groupedTrainings.get(year).push(training);
    });

    // Sort trainings within each year by start date
    this.groupedTrainings.forEach((trainings, year) => {
      trainings.sort((a, b) => new Date(b.startDateTraining).getTime() - new Date(a.startDateTraining).getTime());
    });
  }

  public toggleYear(year: number): void {
    if (this.collapsedYears.has(year)) {
      this.collapsedYears.delete(year);
    } else {
      this.collapsedYears.add(year);
    }
  }

  public isYearCollapsed(year: number): boolean {
    return this.collapsedYears.has(year);
  }

  public getYears(): Array<number> {
    return Array.from(this.groupedTrainings.keys()).sort((a, b) => b - a);
  }

  public get hasTrainingsLoaded(): boolean {
    return !this.isLoading && this.trainings.length > 0;
  }

  public onStatusFilterChange(): void {
    this.applyFilters();
  }

  public onCertificateFilterChange(): void {
    this.applyFilters();
  }

  public onTrainingNameFilterChange(): void {
    this.applyFilters();
  }
}
