import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedialibComponent } from './medialib.component';

describe('MedialibComponent', () => {
  let component: MedialibComponent;
  let fixture: ComponentFixture<MedialibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MedialibComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedialibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
