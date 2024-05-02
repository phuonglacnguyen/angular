import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FolderIdCheckComponent } from './folderidcheck.component';

describe('FooterComponent', () => {
  let component: FolderIdCheckComponent;
  let fixture: ComponentFixture<FolderIdCheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FolderIdCheckComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderIdCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
