import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { Observable } from 'rxjs';

export interface AttachmentInfoTableInterface {
  /**
   * @param modelId - entity id which has attachments
   */
  getAttachmentsListById(modelId: string): Observable<Array<StandardFileStorageModel>>;

  /**
   * @param files - files which need attach to entity (modelId)
   * @param modelId - id entity which need attach files
   */
  uploadAttachments(files, modelId): Observable<any>;

  /**
   * @param fileId - file which need delete from DB
   */
  deleteAttachment(fileId): Observable<any>;
}
