import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedialibNewComponent } from './medialib-new.component';

describe('MedialibNewComponent', () => {
  let component: MedialibNewComponent;
  let fixture: ComponentFixture<MedialibNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MedialibNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedialibNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
