import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsEditComponent } from './cms-edit.component';

describe('CmsEditComponent', () => {
  let component: CmsEditComponent;
  let fixture: ComponentFixture<CmsEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmsEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
