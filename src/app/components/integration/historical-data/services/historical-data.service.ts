import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { HistoricalDataModel } from '@components/integration/historical-data/models/historical-data.model';
import { HistoricalDataUploadInfoModel } from '@components/integration/historical-data/models/historical-data-upload-info.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/historical-data`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public getHistoricalDataUploadInfo(historicalDataId: string): Observable<Array<HistoricalDataUploadInfoModel>> {
    return this.httpClient.get<Array<HistoricalDataUploadInfoModel>>(`${this.url}/info-list/${historicalDataId}`);
  }

  public list(): Observable<Array<HistoricalDataModel>> {
    return this.httpClient.get<Array<HistoricalDataModel>>(this.url);
  }

  public upload(historicalDataModel: HistoricalDataModel): Observable<any> {
    return this.httpClient.post(this.url, this.collectCertificateModelToFormData(historicalDataModel));
  }

  public allHistoricalDataTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allHistoricalDataTypes`);
  }

  private collectCertificateModelToFormData(historicalDataModel: HistoricalDataModel): FormData {
    const formData = new FormData();

    formData.append('historicalDataFile', historicalDataModel.fileStorage?.templateFile);
    formData.append('historicalDataSaveRequestDTO', this.createBlobForFormModel(historicalDataModel));

    return formData;
  }
}
