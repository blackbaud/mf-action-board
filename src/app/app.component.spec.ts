import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeRefreshService } from '../testing/fake-refresh.service';
import { AppComponent } from './app.component';
import { APP_LABELS } from './app.constants';
import { RefreshService } from './refresh.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let componentElements: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: RefreshService, useClass: FakeRefreshService}
      ],
      declarations: [
        AppComponent
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    componentElements = {
      applicationTitle: (): HTMLHeadElement => fixture.nativeElement.querySelector('h1')
    };
    fixture.detectChanges();
  });
  it('should render title', () => {
    expect(componentElements.applicationTitle().textContent).toContain(APP_LABELS.TITLE);
  });
});
