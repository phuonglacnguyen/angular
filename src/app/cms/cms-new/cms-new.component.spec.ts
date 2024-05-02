import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsNewComponent } from './cms-new.component';

describe('CmsNewComponent', () => {
  let component: CmsNewComponent;
  let fixture: ComponentFixture<CmsNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmsNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
