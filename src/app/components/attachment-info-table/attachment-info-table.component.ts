import { Component, ElementRef, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttachmentInfoTableInterface } from '@attachment-info-table-interfaces/attachment-info-table.interface';
import { AttachmentInfoTableTypeEnum } from '@attachment-info-table-models/attachment-info-table-type.enum';
import { CommonComponent } from '@common-components/common.component';
import { FileExceptionEnum } from '@common-models/response-exceptions/file-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { getNewUuid } from '@components/common/functions/uuid.functions';

@Component({
  selector: 'app-attachment-info-table',
  templateUrl: './attachment-info-table.component.html',
  styleUrls: ['./attachment-info-table.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class AttachmentInfoTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @ViewChild('fileInput') fileInput: ElementRef;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'loadAttachmentsNameColTable',
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    injector: Injector,
    private commonAttachmentService: CommonAttachmentService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      title: string;
      type: AttachmentInfoTableTypeEnum;
      modelId?: string;
      attachmentService?: AttachmentInfoTableInterface;
      attachments?: Array<StandardFileStorageModel>;
      isView?: boolean;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadAttachments();
  }

  public loadAttachments(): void {
    switch (this.dialogParams.type) {
      case AttachmentInfoTableTypeEnum.PERSISTENT: {
        this.loadFromDb();
        break;
      }
      case AttachmentInfoTableTypeEnum.TEMPORAL: {
        this.table.commonLoadTableHandler(this.dialogParams.attachments);
        break;
      }
    }
  }

  onFileSelected(): void {
    const inputNode: any = this.fileInput.nativeElement,
      files = inputNode.files;

    switch (this.dialogParams.type) {
      case AttachmentInfoTableTypeEnum.PERSISTENT: {
        this.uploadAttachments(files);
        break;
      }
      case AttachmentInfoTableTypeEnum.TEMPORAL: {
        this.addTempAttachments(files);
        break;
      }
    }
  }

  openRemoveModal(fileStorage: StandardFileStorageModel): void {
    const modalRef = this.showConfirmModal(this.localization.getLocalTextFromKey('deleteRowConfirmTitle'));

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeAttachedFile(fileStorage);
      }
    });
  }

  removeAttachedFile(fileStorage: StandardFileStorageModel): void {
    if (fileStorage) {
      switch (this.dialogParams.type) {
        case AttachmentInfoTableTypeEnum.PERSISTENT: {
          this.removeFromDb(fileStorage);
          break;
        }
        case AttachmentInfoTableTypeEnum.TEMPORAL: {
          this.removeFromAttachments(fileStorage);
          break;
        }
      }
    }
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name,
        fileTemplate = fileStorage.templateFile;

      if (fileTemplate) {
        this.commonAttachmentService.downloadFile(fileTemplate, fileName);
      } else {
        this.commonAttachmentService.loadFileById(fileId, fileName);
      }
    }
  }

  private loadFromDb(): void {
    const modelId = this.dialogParams.modelId;
    this.table.loading = true;

    this.dialogParams.attachmentService.getAttachmentsListById(modelId).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  uploadAttachments(files): void {
    const modelId = this.dialogParams.modelId;

    this.dialogParams.attachmentService.uploadAttachments(files, modelId).subscribe({
      next: data => {
        this.successAttachmentsUploadHandler();
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  private removeFromDb(fileStorage: StandardFileStorageModel): void {
    this.dialogParams.attachmentService.deleteAttachment(fileStorage.id).subscribe({
      next: data => {
        this.successAttachmentRemoveHandler();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  addTempAttachments(files): void {
    for (const file of files) {
      const newAttachment: StandardFileStorageModel = new StandardFileStorageModel();
      newAttachment.id = getNewUuid();
      newAttachment.name = file.name;
      newAttachment.templateFile = file;

      this.dialogParams.attachments.push(newAttachment);
    }

    this.successAttachmentsUploadHandler();
  }

  private removeFromAttachments(fileStorage: StandardFileStorageModel): void {
    const removeIndex: number = this.dialogParams.attachments.findIndex(attachment => {
      return attachment.id === fileStorage.id;
    });

    this.dialogParams.attachments.splice(removeIndex, 1);

    this.successAttachmentRemoveHandler();
  }

  private successAttachmentsUploadHandler(): void {
    const message = this.localization.getLocalTextFromKey('loadAttachmentsSuccessMessage');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
    this.loadAttachments();
  }

  private successAttachmentRemoveHandler(): void {
    const message = this.localization.getLocalTextFromKey('removeAttachmentsSuccessMessage');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
    this.loadAttachments();
  }

  errorHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case FileExceptionEnum.FILE_SIZE_CHECK_EXCEPTION_CONTENT: {
          this.fileSizeCheckExceptionHandler(content);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
  }

  fileSizeCheckExceptionHandler(content): void {
    const maxAvailableSize: string = content.errorCauses[0].maxAvailableSize,
      message: string = this.localization
        .getLocalTextFromKey('loadAttachmentsMaxFileSizeErrorMessage')
        .replace('${fileMaxSize}', maxAvailableSize);

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
  }
}
