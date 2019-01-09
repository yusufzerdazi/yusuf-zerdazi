import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArduinoRobotComponent } from './arduino-robot.component';

describe('ArduinoRobotComponent', () => {
  let component: ArduinoRobotComponent;
  let fixture: ComponentFixture<ArduinoRobotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArduinoRobotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArduinoRobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
