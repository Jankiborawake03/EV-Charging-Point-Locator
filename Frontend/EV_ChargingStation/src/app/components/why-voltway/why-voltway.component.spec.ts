import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyVoltwayComponent } from './why-voltway.component';

describe('WhyVoltwayComponent', () => {
  let component: WhyVoltwayComponent;
  let fixture: ComponentFixture<WhyVoltwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyVoltwayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyVoltwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
