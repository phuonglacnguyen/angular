import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsFiltersComponent } from './cms-filters.component';

describe('CmsListComponent', () => {
  let component: CmsFiltersComponent;
  let fixture: ComponentFixture<CmsFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmsFiltersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
