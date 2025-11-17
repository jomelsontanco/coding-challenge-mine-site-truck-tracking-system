import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TruckSimulatorService } from './truck-simulator-service';
import { Subscription } from 'rxjs';
import { Truck, TruckStatus } from '../models/truck';
import { Coordinate } from '../models/map-definition';

describe('TruckSimulator', () => {
  let service: TruckSimulatorService;
  const mockPosition: Coordinate = { x: 400, y: 400 };
  const mockIdleTruck: Truck = {
    id: 'T-001',
    status: TruckStatus.IDLE,
    speed: 0,
    position: mockPosition,
    withLoad: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit updates every 2 seconds', fakeAsync(() => {
    let truckUpdateCount = 0;
    const subscription: Subscription = service.subscribeToTruckUpdates().subscribe(() => {
      truckUpdateCount++;
    });

    expect(truckUpdateCount).toBe(1);

    service.startSimulation();
    tick(2000);
    expect(truckUpdateCount).toBe(2);
    tick(2000);
    expect(truckUpdateCount).toBe(3);

    service.stopSimulation();
    tick(2000);
    expect(truckUpdateCount).toBe(3);

    subscription.unsubscribe();
  }));

  it('should move truck towards DUMPING zone when withLoad=true and status=HAULING', () => {
    mockIdleTruck.withLoad = true;
    spyOn(service as any, 'isTruckInLoadingZone').and.returnValue(false);
    spyOn(service as any, 'isTruckInDumpingZone').and.returnValue(false);
    spyOn(service as any, 'pickRandom').and.returnValue(TruckStatus.HAULING);

    const newTruck = (service as any).simulateNextMove(mockIdleTruck);

    expect(newTruck.speed).toBeGreaterThan(0);
    expect(newTruck.position.x).toBeGreaterThan(mockIdleTruck.position.x);
    expect(newTruck.position.y).toBeGreaterThan(mockIdleTruck.position.y);
  });

  it('should move truck towards LOADING zone when withLoad=false and status=HAULING', () => {
    mockIdleTruck.withLoad = false;
    spyOn(service as any, 'isTruckInLoadingZone').and.returnValue(false);
    spyOn(service as any, 'isTruckInDumpingZone').and.returnValue(false);
    spyOn(service as any, 'pickRandom').and.returnValue(TruckStatus.HAULING);

    const newTruck = (service as any).simulateNextMove(mockIdleTruck);

    expect(newTruck.speed).toBeGreaterThan(0);
    expect(newTruck.position.x).toBeLessThan(mockIdleTruck.position.x);
    expect(newTruck.position.y).toBeLessThan(mockIdleTruck.position.y);
  });

  it('should pass sanity check for randomness', () => {
    const possibleStatuses = [TruckStatus.IDLE, TruckStatus.LOADING, TruckStatus.DUMPING];
    const N = 1000;
    const selectedStatuses = new Set<TruckStatus>();

    for (let i = 0; i < N; i++) {
      const status: TruckStatus = service['pickRandom'](possibleStatuses);
      selectedStatuses.add(status);

      if (selectedStatuses.size === possibleStatuses.length) {
        break;
      }
    }
    expect(selectedStatuses.size).toBe(possibleStatuses.length);
  });
});
