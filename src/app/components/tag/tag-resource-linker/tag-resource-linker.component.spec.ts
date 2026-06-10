import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagResourceLinkerComponent } from './tag-resource-linker.component';

describe('TagResourceLinkerComponent', () => {
  let component: TagResourceLinkerComponent;
  let fixture: ComponentFixture<TagResourceLinkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagResourceLinkerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagResourceLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
