import { Component, ElementRef, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { WithFileStorageInterface } from '@common-input-file-models/withFileStorage.interface';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';

@Component({
  selector: 'app-common-input-file',
  templateUrl: './common-input-file.component.html',
  styleUrls: ['./common-input-file.component.scss'],
  standalone: false,
})
export class CommonInputFileComponent extends CommonComponent {
  @Input() allowedFormats: string;
  @Input() model: WithFileStorageInterface;
  @Input() isView: boolean;
  @ViewChild('fileInput') fileInput: ElementRef;
  public fileLoadInProcess: boolean = false;
  public invalidFileFormat: boolean = false;

  constructor(
    injector: Injector,
    private commonAttachmentService: CommonAttachmentService,
  ) {
    super(injector);
  }

  onFileSelected(): void {
    const inputNode: any = this.fileInput.nativeElement,
      file = inputNode.files[0],
      reader = new FileReader();

    this.fileLoadInProcess = true;
    this.invalidFileFormat = false;

    reader.onload = (e: any) => {
      this.fileLoadedHandler(file);
    };

    reader.readAsArrayBuffer(file);
  }

  private fileLoadedHandler(file: File): void {
    this.fileLoadInProcess = false;

    if (this.checkFileFormat(file)) {
      const fileStorage = new StandardFileStorageModel();
      fileStorage.id = null;
      fileStorage.name = file.name;
      fileStorage.templateFile = file;

      this.model.fileStorage = fileStorage;
    } else {
      this.invalidFileFormat = true;
    }
  }

  private checkFileFormat(file: File): boolean {
    if (!this.allowedFormats || this.allowedFormats?.trim().length === 0) {
      return true;
    }

    return this.allowedFormats.split(', ').includes(file.type);
  }

  loadAttachedFile(): void {
    const inputNode: any = this.fileInput.nativeElement,
      file = inputNode.files[0];

    if (!file) {
      const fileId = this.model.fileStorage.id,
        fileName = this.model.fileStorage.name;

      this.commonAttachmentService.loadFileById(fileId, fileName);
    } else {
      this.commonAttachmentService.downloadFile(file, file.name);
    }
  }

  removeFile(): void {
    const inputNode: any = this.fileInput.nativeElement;
    inputNode.value = '';
    this.model.fileStorage.templateFile = null;
    this.model.fileStorage.id = null;
    this.model.fileStorage.name = null;
  }
}
