import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyViewModalComponent } from './body-view-modal.component';

describe('BodyViewModalComponent', () => {
  let component: BodyViewModalComponent;
  let fixture: ComponentFixture<BodyViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyViewModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BodyViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
