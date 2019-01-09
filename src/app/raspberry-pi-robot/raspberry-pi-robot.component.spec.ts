import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaspberryPiRobotComponent } from './raspberry-pi-robot.component';

describe('RaspberryPiRobotComponent', () => {
  let component: RaspberryPiRobotComponent;
  let fixture: ComponentFixture<RaspberryPiRobotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspberryPiRobotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaspberryPiRobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
