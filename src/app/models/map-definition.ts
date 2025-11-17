import { TruckStatus } from './truck';

export interface MapDefinition {
  height: number;
  width: number;
  loadingZone: Zone;
  dumpingZone: Zone;
  truckStatusColors: Record<TruckStatus, string>;
  truckCircleRadius: number;
  textFontSize: number;
  textMaxLength: number;
}

export interface Zone {
  colorHex: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
