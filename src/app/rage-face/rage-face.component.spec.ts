import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RageFaceComponent } from './rage-face.component';

describe('RageFaceComponent', () => {
  let component: RageFaceComponent;
  let fixture: ComponentFixture<RageFaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RageFaceComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RageFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
