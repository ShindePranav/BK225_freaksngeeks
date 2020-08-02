import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderDashboardComponent } from './tender-dashboard.component';

describe('TenderDashboardComponent', () => {
  let component: TenderDashboardComponent;
  let fixture: ComponentFixture<TenderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
