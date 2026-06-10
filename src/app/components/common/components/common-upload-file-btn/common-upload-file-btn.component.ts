import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';

@Component({
  selector: 'app-common-upload-file-btn',
  templateUrl: './common-upload-file-btn.component.html',
  styleUrls: ['./common-upload-file-btn.component.scss'],
  standalone: false,
})
export class CommonUploadFileBtnComponent extends CommonComponent {
  @Input() acceptFormats: string;
  @Input() invalidFormatMessageKey: string;
  @Output() fileSelectedHandler = new EventEmitter();
  @ViewChild('fileInput') fileInput: ElementRef;

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(): void {
    const inputNode: any = this.fileInput.nativeElement,
      file = inputNode.files[0],
      reader = new FileReader();

    reader.onload = (e: any) => {
      this.fileLoadedHandler(file);
    };

    reader.readAsArrayBuffer(file);
  }

  private fileLoadedHandler(file: File): void {
    if (this.checkFileFormat(file)) {
      this.fileSelectedHandler.emit(file);
    } else {
      this.invalidFileFormatHandler();
    }
  }

  private invalidFileFormatHandler(): void {
    const messageKey: string = this.invalidFormatMessageKey
      ? this.invalidFormatMessageKey
      : 'validatorsInvalidFileFormat';

    this.showSnackBarWithMessage(this.localization.getLocalTextFromKey(messageKey), SnackBarTypeEnum.ERROR);
  }

  private checkFileFormat(file: File): boolean {
    if (!this.acceptFormats || this.acceptFormats?.trim().length === 0) {
      return true;
    }

    return this.acceptFormats.split(', ').includes(file.type);
  }
}
