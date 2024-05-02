import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedialibListComponent } from './medialib-list.component';

describe('MedialibListComponent', () => {
  let component: MedialibListComponent;
  let fixture: ComponentFixture<MedialibListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MedialibListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedialibListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
