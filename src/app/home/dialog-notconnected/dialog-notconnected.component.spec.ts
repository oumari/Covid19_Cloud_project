import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNotconnectedComponent } from './dialog-notconnected.component';

describe('DialogNotconnectedComponent', () => {
  let component: DialogNotconnectedComponent;
  let fixture: ComponentFixture<DialogNotconnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNotconnectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNotconnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
