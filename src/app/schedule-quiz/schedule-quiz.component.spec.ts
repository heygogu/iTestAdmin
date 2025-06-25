import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleQuizComponent } from './schedule-quiz.component';

describe('ScheduleQuizComponent', () => {
  let component: ScheduleQuizComponent;
  let fixture: ComponentFixture<ScheduleQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
