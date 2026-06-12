import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationHostComponent } from './station-host.component';

describe('StationHostComponent', () => {
  let component: StationHostComponent;
  let fixture: ComponentFixture<StationHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
