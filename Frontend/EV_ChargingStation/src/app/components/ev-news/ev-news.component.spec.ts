import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvNewsComponent } from './ev-news.component';

describe('EvNewsComponent', () => {
  let component: EvNewsComponent;
  let fixture: ComponentFixture<EvNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
