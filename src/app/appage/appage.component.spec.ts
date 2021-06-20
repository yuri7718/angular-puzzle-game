import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppageComponent } from './appage.component';

describe('AppageComponent', () => {
  let component: AppageComponent;
  let fixture: ComponentFixture<AppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
