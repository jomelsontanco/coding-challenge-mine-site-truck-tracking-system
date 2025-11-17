import { MapDefinition } from '../models/map-definition';
import { TruckStatus } from '../models/truck';

export const MOCK_MAP: MapDefinition = {
  height: 800,
  width: 1000,
  loadingZone: {
    colorHex: '#00FF00',
    minX: 0,
    maxX: 100,
    minY: 0,
    maxY: 100,
  },
  dumpingZone: {
    colorHex: '#FF0000',
    minX: 900,
    maxX: 1000,
    minY: 700,
    maxY: 800,
  },
  truckStatusColors: {
    [TruckStatus.LOADING]: '#FFA500',
    [TruckStatus.HAULING]: '#28A745',
    [TruckStatus.DUMPING]: '#007BFF',
    [TruckStatus.IDLE]: '#6C757D',
  },
  truckCircleRadius: 8,
  textFontSize: 25,
  textMaxLength: 14
};
