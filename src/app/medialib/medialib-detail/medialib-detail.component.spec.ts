import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedialibDetailComponent } from './medialib-detail.component';
import { VideoplayerComponent } from '../../videoplayer/videoplayer.component';

describe('MedialibEditComponent', () => {
  let component: MedialibDetailComponent;
  let fixture: ComponentFixture<MedialibDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MedialibDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedialibDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
