import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterDetail } from './semester-detail';

describe('SemesterDetail', () => {
  let component: SemesterDetail;
  let fixture: ComponentFixture<SemesterDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SemesterDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
