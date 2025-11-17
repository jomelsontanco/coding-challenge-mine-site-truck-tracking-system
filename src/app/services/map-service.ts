import { Injectable } from '@angular/core';
import { MapDefinition } from '../models/map-definition';
import { MOCK_MAP } from '../mock-data/mock-map-definition';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  getMap(): MapDefinition {
    return MOCK_MAP
  }
}
