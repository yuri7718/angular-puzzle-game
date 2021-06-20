import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgpageComponent } from './pgpage.component';

describe('PgpageComponent', () => {
  let component: PgpageComponent;
  let fixture: ComponentFixture<PgpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
