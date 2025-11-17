import { TestBed } from '@angular/core/testing';

import { MapService } from './map-service';
import { MapDefinition } from '../models/map-definition';

describe('MapService', () => {
  let service: MapService;
  let result: MapDefinition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapService);
    result = service.getMap();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an object that structurally conforms to MapDefinition', () => {
    expect(result.height).toBeDefined();
    expect(typeof result.height).toBe('number');

    expect(result.width).toBeDefined();
    expect(typeof result.width).toBe('number');

    expect(result.truckCircleRadius).toBeDefined();
    expect(typeof result.truckCircleRadius).toBe('number');

    expect(result.textFontSize).toBeDefined();
    expect(typeof result.textFontSize).toBe('number');

    expect(result.textMaxLength).toBeDefined();
    expect(typeof result.textMaxLength).toBe('number');

    expect(result.loadingZone).toBeDefined();
    expect(typeof result.loadingZone).toBe('object');

    expect(result.dumpingZone).toBeDefined();
    expect(typeof result.dumpingZone).toBe('object');

    expect(result.truckStatusColors).toBeDefined();
    expect(typeof result.truckStatusColors).toBe('object');
    expect(Array.isArray(result.truckStatusColors)).toBe(false);
  });

  it('should have distinct colors for loading and dumping zone', () => {
    expect(result.loadingZone.colorHex).not.toEqual(result.dumpingZone.colorHex);
  });
});
