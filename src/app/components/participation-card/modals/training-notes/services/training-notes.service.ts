import { Injectable, Injector } from '@angular/core';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { TrainingNoteModel } from '@participation-card-modals-training-notes-models/training-note.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingNotesService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/notes/trainings`;

  constructor(injector: Injector) {
    super(injector);
  }

  public list(trainingId: string): Observable<Array<TrainingNoteModel>> {
    return this.httpClient.get<Array<TrainingNoteModel>>(`${this.url}/get-all-by-training/${trainingId}`);
  }

  public create(trainingNote: TrainingNoteModel): Observable<any> {
    return this.httpClient.post<any>(this.url, this.collectCertificateModelToFormData(trainingNote));
  }

  public getById(trainingNoteId: string): Observable<TrainingNoteModel> {
    return this.httpClient.get<TrainingNoteModel>(`${this.url}/${trainingNoteId}`);
  }

  public update(trainingNote: TrainingNoteModel): Observable<any> {
    return this.httpClient.put<any>(this.url, this.collectCertificateModelToFormData(trainingNote));
  }

  public delete(noteIds: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, noteIds);
  }

  private collectCertificateModelToFormData(trainingNote: TrainingNoteModel): FormData {
    const formData = new FormData();

    formData.append('noteTrainingSaveUpdateRequestDTO', this.createBlobForFormModel(trainingNote));
    formData.append('templateFile', trainingNote.fileStorage?.templateFile);

    return formData;
  }
}
