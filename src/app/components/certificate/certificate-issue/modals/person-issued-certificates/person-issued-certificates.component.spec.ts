import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonIssuedCertificatesComponent } from './person-issued-certificates.component';

describe('PersonIssuedCertificatesComponent', () => {
  let component: PersonIssuedCertificatesComponent;
  let fixture: ComponentFixture<PersonIssuedCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonIssuedCertificatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonIssuedCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
