import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trainingTemplateCertificateTemplatesPipe',
  standalone: false,
})
export class TrainingTemplateCertificateTemplatesPipe implements PipeTransform {
  transform(trainingTemplate: any): string {
    return trainingTemplate.certificateTemplates?.map(cert => cert.name).join(', ') ?? '';
  }
}
