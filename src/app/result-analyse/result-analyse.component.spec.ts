import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAnalyseComponent } from './result-analyse.component';

describe('ResultAnalyseComponent', () => {
  let component: ResultAnalyseComponent;
  let fixture: ComponentFixture<ResultAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultAnalyseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
