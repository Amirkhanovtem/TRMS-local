import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonComponent } from '@common-components/common.component';
import { TimetableDisplayVisualSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-visual-settings.model';
import { TimetableDisplaySettingsService } from '@components/dictionaries/other-group/timetable-display/services/timetable-display-settings.service';
import { TimetableTvBoardModel } from '@components/timetable-tv-board/models/timetableTvBoard.model';
import { TimetableTvBoardService } from '@components/timetable-tv-board/services/timetable-tv-board.service';
import { getBaseHref } from '@utils/base-path';
import { map, Subscription, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-timetable-tv-board',
  templateUrl: './timetable-tv-board.component.html',
  styleUrls: ['./timetable-tv-board.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: false,
})
export class TimetableTvBoardComponent extends CommonComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public readonly DEFAULT_SEPARATOR: string = ' • ';
  public readonly DEFAULT_PAGE_SIZE: number = 7;
  public readonly DEFAULT_PAGE_SWITCH_INTERVAL: number = 15;
  public readonly DEFAULT_UPDATE_VISUAL_SETTINGS_INTERVAL: number = 60;
  public readonly baseHref: string = getBaseHref();

  public displayedColumns: Array<string> = ['time', 'training', 'audience', 'trainer'];
  public dataSource: MatTableDataSource<TimetableTvBoardModel> = new MatTableDataSource<TimetableTvBoardModel>([]);
  public currentDate: Date = new Date();
  public pageSwitchInterval: number = this.DEFAULT_PAGE_SWITCH_INTERVAL;
  public subscription: Subscription;

  constructor(
    injector: Injector,
    private timetableTvBoardService: TimetableTvBoardService,
    private timetableDisplaySettingsService: TimetableDisplaySettingsService,
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.preparePage();
  }

  private preparePage(): void {
    this.setDateTimer();
    this.setVisualSettingsTimer();
    this.loadData();
  }

  private setVisualSettingsTimer(): void {
    const interval: number = this.DEFAULT_UPDATE_VISUAL_SETTINGS_INTERVAL * 1000;

    timer(0, interval)
      .pipe(takeUntil(this.destroyService$))
      .subscribe(() => {
        this.loadVisualSettings();
      });
  }

  private loadVisualSettings(): void {
    this.timetableDisplaySettingsService
      .getVisualSettings()
      .pipe(takeUntil(this.destroyService$))
      .subscribe({
        next: (visualSettings: TimetableDisplayVisualSettingsModel) => {
          this.updateVisualSettings(visualSettings);
        },
      });
  }

  private updateVisualSettings(visualSettings: TimetableDisplayVisualSettingsModel): void {
    this.pageSwitchInterval = visualSettings.pageSwitchInterval;
  }

  private setDateTimer(): void {
    timer(0, 1000)
      .pipe(
        takeUntil(this.destroyService$),
        map(() => new Date()),
      )
      .subscribe(time => {
        this.currentDate = time;
      });
  }

  private getPageSwitchInterval(): number {
    const interval: number = this.pageSwitchInterval || this.DEFAULT_PAGE_SWITCH_INTERVAL;

    return interval * 1000;
  }

  private setAutoSwitchPage(): void {
    const interval: number = this.getPageSwitchInterval();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = timer(interval, interval)
      .pipe(takeUntil(this.destroyService$))
      .subscribe(() => this.switchPage());
  }

  private switchPage(): void {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    } else {
      this.loadData();
    }
  }

  private loadData(): void {
    this.timetableTvBoardService
      .getTimeTableTvBoardData()
      .pipe(takeUntil(this.destroyService$))
      .subscribe({
        next: (data: Array<TimetableTvBoardModel>) => {
          this.updateTableData(data);
        },
      });
  }

  private updateTableData(data: Array<TimetableTvBoardModel>): void {
    this.dataSource = new MatTableDataSource<TimetableTvBoardModel>(data);
    this.dataSource.paginator = this.paginator;
    this.paginator.firstPage();
    this.setAutoSwitchPage();
  }
}
