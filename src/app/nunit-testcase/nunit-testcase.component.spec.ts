import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NunitTestcaseComponent } from './nunit-testcase.component';

describe('NunitTestcaseComponent', () => {
  let component: NunitTestcaseComponent;
  let fixture: ComponentFixture<NunitTestcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NunitTestcaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NunitTestcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
