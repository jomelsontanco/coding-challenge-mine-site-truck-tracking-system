import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map-component';
import { MOCK_MAP } from '../../mock-data/mock-map-definition';
import { By } from '@angular/platform-browser';
import { MapService } from '../../services/map-service';

const mockMapService = {
  getMap: () => MOCK_MAP,
};

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockCtx: CanvasRenderingContext2D;
  let fillStyleSpy = jasmine.createSpy('fillStyleSetter');
  let strokeStyleSpy = jasmine.createSpy('strokeStyleSetter');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: MapService, useValue: mockMapService }],
    }).compileComponents();
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fillStyleSpy = jasmine.createSpy('fillStyleSetter');
    strokeStyleSpy = jasmine.createSpy('strokeStyleSetter');
    mockCtx = {
      fillRect: jasmine.createSpy('fillRect'),
      strokeRect: jasmine.createSpy('strokeRect'),
      clearRect: jasmine.createSpy('clearRect'),
      get fillStyle() {
        return '';
      },
      set fillStyle(value: string) {
        fillStyleSpy(value);
      },
      get strokeStyle() {
        return '';
      },
      set strokeStyle(value: string) {
        strokeStyleSpy(value);
      },
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D;
    spyOn(component.canvasRef.nativeElement, 'getContext').and.returnValue(mockCtx);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fillRect and strokeRect twice to draw both zones', () => {
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
    expect(mockCtx.strokeRect).toHaveBeenCalledTimes(2);
  });

  it('should call fillStyle and strokeStyle twice to color both zones', () => {
    expect(fillStyleSpy).toHaveBeenCalledTimes(2);
    expect(strokeStyleSpy).toHaveBeenCalledTimes(2);
  });

  it('should draw the loading zone with correct coordinates', () => {
    const margin = component.CLIPPING_MARGIN;
    const zone = component.mapData.loadingZone;
    const expectedX = zone.minX + margin;
    const expectedY = zone.minY + margin;
    const expectedWidth = zone.maxX - zone.minX;
    const expectedHeight = zone.maxY - zone.minY;

    expect(mockCtx.fillRect).toHaveBeenCalledWith(
      expectedX,
      expectedY,
      expectedWidth,
      expectedHeight
    );

    expect(mockCtx.strokeRect).toHaveBeenCalledWith(
      expectedX,
      expectedY,
      expectedWidth,
      expectedHeight
    );
  });

  it('should draw the dumping zone with correct coordinates', () => {
    const margin = component.CLIPPING_MARGIN;
    const zone = component.mapData.dumpingZone;
    const expectedX = zone.minX + margin;
    const expectedY = zone.minY + margin;
    const expectedWidth = zone.maxX - zone.minX;
    const expectedHeight = zone.maxY - zone.minY;

    expect(mockCtx.fillRect).toHaveBeenCalledWith(
      expectedX,
      expectedY,
      expectedWidth,
      expectedHeight
    );

    expect(mockCtx.strokeRect).toHaveBeenCalledWith(
      expectedX,
      expectedY,
      expectedWidth,
      expectedHeight
    );
  });

  it('should draw a truck circle and text in the SVG layer', () => {
    const truckCircle = fixture.debugElement.query(By.css('circle'));
    expect(truckCircle).toBeTruthy;

    const truckText = fixture.debugElement.query(By.css('text'));
    expect(truckText).toBeTruthy();
  });

  it('should calculated a shifted dimension more than base dimension', () => {
    expect(component.SHIFTED_WIDTH).toBeGreaterThan(component.mapData.width);
    expect(component.SHIFTED_HEIGHT).toBeGreaterThan(component.mapData.height);

    const container = fixture.debugElement.query(By.css('.container'));
    const styleWidth = container.styles['width'];
    const styleHeight = container.styles['height'];
    const containerWidth = parseInt(styleWidth ?? '', 10);
    const containerHeight = parseInt(styleHeight ?? '', 10);
    expect(containerWidth).not.toBeNaN();
    expect(containerHeight).not.toBeNaN();
    expect(containerWidth).toBeGreaterThan(component.mapData.width);
    expect(containerHeight).toBeGreaterThan(component.mapData.height);
  });
});
