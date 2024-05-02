import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsListComponent } from './cms-list.component';

describe('CmsListComponent', () => {
  let component: CmsListComponent;
  let fixture: ComponentFixture<CmsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
