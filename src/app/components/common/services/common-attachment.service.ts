import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';

@Injectable({
  providedIn: 'root',
})
export class CommonAttachmentService extends CommonService {
  protected fileLoadResponseOption = {
    responseType: 'blob' as 'json',
    observe: 'response' as any,
  };

  public getFileNameFromContentDisposition(resp: any): string {
    const standardName = 'newFile.pdf';

    const contentDisposition = resp.headers.get('content-disposition');

    if (contentDisposition) {
      let fileName = contentDisposition.split('filename*=UTF-8');
      if (fileName.length >= 2) {
        fileName = decodeURI(fileName[1].slice(2).trim()).replace('+', '%20');

        return fileName;
      }
    }

    return standardName;
  }

  /**
   * Load file from file storage
   * @param fileId UUID file storage
   * @param fileName the name of the file with which it will be loaded (NAME WITH FORMAT. EXAMPLE text.doc, cats.pdf)
   */
  public loadFileById(fileId: string, fileName: string): void {
    const loadFileUrl = Config.MAIN_API_FILE_STORAGE_LOAD_FILE_URL + '/' + fileId;

    this.httpClient.get(loadFileUrl, this.fileLoadResponseOption).subscribe((resp: any) => {
      this.downloadFile(resp.body, fileName);
    });
  }

  public downloadFileSuccessHandler(resp: any): void {
    const fileName = this.getFileNameFromContentDisposition(resp);

    this.downloadFile(resp.body, fileName);
  }

  public downloadFile(file: any, fileName: string): void {
    const downloadURL = window.URL.createObjectURL(file),
      link = document.createElement('a');

    link.href = downloadURL;
    link.download = fileName;
    link.click();
    link.remove();
  }

  public openViewPdfInNewTab(file: any, fileName: string): void {
    const blob = new File([file], fileName, { type: 'application/pdf' }),
      viewPdfURL = window.URL.createObjectURL(blob);

    window.open(viewPdfURL, '_blank');
  }

  protected createBlobForFormModel(model): Blob {
    const jsonModel: string = JSON.stringify(model),
      blobOptions = {
        type: 'application/json',
      };

    return new Blob([jsonModel], blobOptions);
  }
}
