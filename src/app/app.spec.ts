import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';
import { MapComponent } from './components/map-component/map-component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render map component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const childDebugElement = fixture.debugElement.query(By.directive(MapComponent));
    expect(childDebugElement).not.toBeNull();
  });
});
