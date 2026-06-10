import { CertificateForReissueModel } from '@components/certificate/reissue-certificate-modal/models/certificate-for-reissue.model';
import { NewCertificateModel } from '@components/certificate/reissue-certificate-modal/models/new-certificate.model';

export class ReissueCertificateModel {
  public certificatesForReissue: Array<CertificateForReissueModel>;
  public newCertificateByUser: NewCertificateModel;
  public newCertificateBySystem: NewCertificateModel;
  public isCreateBySystem: boolean;
}
