import { Injectable } from '@angular/core';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { CommonSnackBarService } from '@common-services/common-snack-bar.service';
import { Localization } from '@localization/localization';

@Injectable({
  providedIn: 'root',
})
export class CommonResponseService {
  constructor(
    private localization: Localization,
    private commonSnackBarService: CommonSnackBarService,
  ) {}

  public successResponseHandler(messageKey: string): void {
    const message = this.localization.getLocalTextFromKey(messageKey);

    this.commonSnackBarService.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
  }

  public errorResponseHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.defaultErrorResponseHandler();
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.COMMON_MESSAGE_CONTENT: {
          this.commonMessageContentHandler(content.errorCauses);
          break;
        }
        default:
          this.defaultErrorResponseHandler();
      }
    });
  }

  private commonMessageContentHandler(errorCauses: Array<any>): void {
    if (!errorCauses) {
      return;
    }

    errorCauses.forEach(errorCause => {
      this.commonSnackBarService.showSnackBarWithMessage(errorCause.message, SnackBarTypeEnum.ERROR);
    });
  }

  private defaultErrorResponseHandler(): void {
    const message = this.localization.getLocalTextFromKey('errorMessage');

    this.commonSnackBarService.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
  }
}
