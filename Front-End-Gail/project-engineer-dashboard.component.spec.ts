import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEngineerDashboardComponent } from './project-engineer-dashboard.component';

describe('ProjectEngineerDashboardComponent', () => {
  let component: ProjectEngineerDashboardComponent;
  let fixture: ComponentFixture<ProjectEngineerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEngineerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEngineerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
