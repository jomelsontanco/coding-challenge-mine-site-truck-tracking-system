import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import {
  DumpingTruckStatuses,
  HaulingTruckStatuses,
  LoadingTruckStatuses,
  Truck,
  TruckStatus,
} from '../models/truck';
import { Coordinate, MapDefinition, Zone } from '../models/map-definition';
import { MapService } from './map-service';

@Injectable({
  providedIn: 'root',
})
export class TruckSimulatorService implements OnDestroy {
  private _truckInitialState: Truck;
  private _truckSubject: BehaviorSubject<Truck>;
  private _simulationSubscription: Subscription = new Subscription();
  private _map: MapDefinition;
  private readonly X_MIN_JUMP = 80;
  private readonly X_MAX_JUMP = 100;
  private readonly Y_MIN_JUMP = 60;
  private readonly Y_MAX_JUMP = 80;

  constructor(mapService: MapService) {
    this._map = mapService.getMap();
    this._truckInitialState = {
      id: 'T-001',
      status: TruckStatus.IDLE,
      speed: 0,
      position: { x: this._map.loadingZone.maxX / 2, y: this._map.loadingZone.maxY / 2 },
      withLoad: false,
    };
    this._truckSubject = new BehaviorSubject<Truck>(this._truckInitialState);
  }

  ngOnDestroy(): void {
    this._simulationSubscription.unsubscribe();
  }

  startSimulation(): void {
    this._simulationSubscription = interval(2000).subscribe(() => {
      const currentTruck = this._truckSubject.getValue();
      const newTruck = this.simulateNextMove(currentTruck);
      console.log(JSON.parse(JSON.stringify(newTruck)));
      this._truckSubject.next(newTruck);
    });
  }

  stopSimulation(): void {
    this._simulationSubscription.unsubscribe();
  }

  subscribeToTruckUpdates(): Observable<Truck> {
    return this._truckSubject.asObservable();
  }

  private simulateNextMove(currentTruck: Truck): Truck {
    let newTruck = { ...currentTruck };
    if (this.isTruckInLoadingZone(currentTruck)) {
      newTruck.status = this.pickRandom(LoadingTruckStatuses);
    } else if (this.isTruckInDumpingZone(currentTruck)) {
      newTruck.status = this.pickRandom(DumpingTruckStatuses);
    } else {
      newTruck.status = this.pickRandom(HaulingTruckStatuses);
    }

    if (newTruck.status === TruckStatus.LOADING) {
      newTruck.withLoad = true;
    } else if (newTruck.status === TruckStatus.DUMPING) {
      newTruck.withLoad = false;
    }

    if (newTruck.status != TruckStatus.HAULING) {
      newTruck.speed = 0;
    } else {
      newTruck.speed = Math.floor(Math.random() * 60) + 1;
      if (newTruck.withLoad) {
        newTruck.position = this.moveTowardsDumpingZone(currentTruck.position);
      } else {
        newTruck.position = this.moveTowardsLoadingZone(currentTruck.position);
      }
    }

    return newTruck;
  }

  private isTruckInZone(truck: Truck, zone: Zone): boolean {
    const isXInside = truck.position.x >= zone.minX && truck.position.x <= zone.maxX;
    const isYInside = truck.position.y >= zone.minY && truck.position.y <= zone.maxY;
    return isXInside && isYInside;
  }

  private isTruckInLoadingZone(truck: Truck): boolean {
    return this.isTruckInZone(truck, this._map.loadingZone);
  }

  private isTruckInDumpingZone(truck: Truck): boolean {
    return this.isTruckInZone(truck, this._map.dumpingZone);
  }

  private pickRandom(truckStatuses: TruckStatus[]): TruckStatus {
    const randomIndex = Math.floor(Math.random() * truckStatuses.length);
    return truckStatuses[randomIndex];
  }

  private moveTowardsDumpingZone(currentPosition: Coordinate): Coordinate {
    const newPositionX =
      currentPosition.x + this.randomPixelMovement(this.X_MIN_JUMP, this.X_MAX_JUMP);
    const newPositionY =
      currentPosition.y + this.randomPixelMovement(this.Y_MIN_JUMP, this.Y_MAX_JUMP);
    return {
      x:
        newPositionX > this._map.width
          ? this.randomPixelMovement(this._map.dumpingZone.minX, this._map.dumpingZone.maxX)
          : newPositionX,
      y:
        newPositionY >
        this.randomPixelMovement(this._map.dumpingZone.minY, this._map.dumpingZone.maxY)
          ? this._map.height
          : newPositionY,
    };
  }

  private moveTowardsLoadingZone(currentPosition: Coordinate): Coordinate {
    const newPositionX =
      currentPosition.x - this.randomPixelMovement(this.X_MIN_JUMP, this.X_MAX_JUMP);
    const newPositionY =
      currentPosition.y - this.randomPixelMovement(this.Y_MIN_JUMP, this.Y_MAX_JUMP);
    return {
      x:
        newPositionX < 0
          ? this.randomPixelMovement(this._map.loadingZone.minX, this._map.loadingZone.maxX)
          : newPositionX,
      y: newPositionY < 0 ? (this._map.loadingZone.minY, this._map.loadingZone.maxY) : newPositionY,
    };
  }

  private randomPixelMovement(minJump: number, maxJump: number): number {
    return Math.floor(Math.random() * (maxJump - minJump + 1)) + minJump;
  }
}
