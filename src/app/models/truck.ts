import { Coordinate } from './map-definition';

export enum TruckStatus {
  LOADING = 'LOADING',
  HAULING = 'HAULING',
  DUMPING = 'DUMPING',
  IDLE = 'IDLE',
}

export const LoadingTruckStatuses: TruckStatus[] = [
  TruckStatus.LOADING,
  TruckStatus.IDLE,
  TruckStatus.HAULING,
] as const;

export const HaulingTruckStatuses: TruckStatus[] = [TruckStatus.HAULING, TruckStatus.IDLE] as const;

export const DumpingTruckStatuses: TruckStatus[] = [
  TruckStatus.DUMPING,
  TruckStatus.IDLE,
  TruckStatus.HAULING,
] as const;

export interface Truck {
  id: string;
  status: TruckStatus;
  speed: number;
  position: Coordinate;
  withLoad: boolean;
}
