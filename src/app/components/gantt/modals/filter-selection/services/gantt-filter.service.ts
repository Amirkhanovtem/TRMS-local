import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { Config } from '@config/config';
import { GanttFilterData } from '@gantt-modals-filter-selection-models/gantt-filter-data.model';
import { GanttFilterSelectedHierarchyData } from '@gantt-modals-filter-selection-models/gantt-filter-selected-hierarchy-data';
import { GanttViewRangeData } from '@gantt-modals-view-selection-models/gantt-view-range-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GanttFilterService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/gantt-filters`;

  constructor(
    private http: HttpClient,
    injector: Injector,
  ) {
    super(injector);
  }

  public roomHierarchy(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/tree/room`);
  }

  public trainerHierarchy(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/tree/trainer`);
  }

  public equipmentHierarchy(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/tree/equipment`);
  }

  public selectedRooms(): Observable<GanttFilterSelectedHierarchyData> {
    return this.httpClient.get<GanttFilterSelectedHierarchyData>(`${this.url}/tree/room/selected`);
  }

  public selectedTrainers(): Observable<GanttFilterSelectedHierarchyData> {
    return this.httpClient.get<GanttFilterSelectedHierarchyData>(`${this.url}/tree/trainer/selected`);
  }

  public selectedEquipments(): Observable<GanttFilterSelectedHierarchyData> {
    return this.httpClient.get<GanttFilterSelectedHierarchyData>(`${this.url}/tree/equipment/selected`);
  }

  public selectedRange(): Observable<GanttViewRangeData> {
    return this.httpClient.get<GanttViewRangeData>(`${this.url}/range`);
  }

  public saveFilter(ganttFilterData: GanttFilterData): Observable<any> {
    return this.httpClient.post<GanttFilterSelectedHierarchyData>(`${this.url}/save-filter`, ganttFilterData);
  }

  public saveRange(ganttViewRangeData: GanttViewRangeData): Observable<any> {
    return this.httpClient.post<GanttFilterSelectedHierarchyData>(`${this.url}/save-range`, ganttViewRangeData);
  }
}
