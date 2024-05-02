import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageblokComponent } from './homepageblok.component';

describe('HomepageblokComponent', () => {
  let component: HomepageblokComponent;
  let fixture: ComponentFixture<HomepageblokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageblokComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageblokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
