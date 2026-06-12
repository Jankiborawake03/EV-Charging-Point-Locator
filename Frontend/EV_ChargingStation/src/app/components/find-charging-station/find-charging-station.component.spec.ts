import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindChargingStationComponent } from './find-charging-station.component';

describe('FindChargingStationComponent', () => {
  let component: FindChargingStationComponent;
  let fixture: ComponentFixture<FindChargingStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindChargingStationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindChargingStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
