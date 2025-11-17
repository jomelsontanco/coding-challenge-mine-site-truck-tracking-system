import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TruckSimulatorService } from '../../services/truck-simulator-service';
import { MapService } from '../../services/map-service';
import { map, Observable } from 'rxjs';
import { Truck } from '../../models/truck';
import { MapDefinition, Zone } from '../../models/map-definition';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-map-component',
  imports: [AsyncPipe],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  truck$: Observable<Truck>;
  mapData: MapDefinition;
  CLIPPING_MARGIN: number;
  SHIFTED_WIDTH: number;
  SHIFTED_HEIGHT: number;
  SHIFTED_VIEW_BOX: string;

  private ESTIMATED_TEXT_WIDTH: number;
  private readonly PIXEL_PER_FONT_UNIT_RATIO = 0.65;

  constructor(
    private readonly truckSimulator: TruckSimulatorService,
    private readonly mapProvider: MapService
  ) {
    this.mapData = this.mapProvider.getMap();
    this.ESTIMATED_TEXT_WIDTH =
      this.mapData.textFontSize * this.mapData.textMaxLength * this.PIXEL_PER_FONT_UNIT_RATIO;
    this.CLIPPING_MARGIN = Math.ceil(this.ESTIMATED_TEXT_WIDTH / 2);
    this.SHIFTED_WIDTH = this.mapData.width + 2 * this.CLIPPING_MARGIN;
    this.SHIFTED_HEIGHT = this.mapData.height + 2 * this.CLIPPING_MARGIN;
    this.SHIFTED_VIEW_BOX = `${-this.CLIPPING_MARGIN} ${-this.CLIPPING_MARGIN} ${this.SHIFTED_WIDTH} ${this.SHIFTED_HEIGHT}`;
    this.truck$ = this.truckSimulator.subscribeToTruckUpdates().pipe(
      map((raw) => ({
        ...raw,
        cx: raw.position.x + this.CLIPPING_MARGIN,
        cy: raw.position.y + this.CLIPPING_MARGIN,
      }))
    );
  }

  ngOnInit(): void {
    this.truckSimulator.startSimulation();
  }

  ngAfterViewInit(): void {
    this.drawCanvasZones();
  }

  private drawZone(ctx: CanvasRenderingContext2D, zone: Zone): void {
    const x = zone.minX + this.CLIPPING_MARGIN;
    const y = zone.minY + this.CLIPPING_MARGIN;
    const width = zone.maxX - zone.minX;
    const height = zone.maxY - zone.minY;
    const colorHex = zone.colorHex;

    ctx.fillStyle = `${colorHex}4D`;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }

  private drawCanvasZones(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    console.log('ctx: ', ctx);
    if (!ctx) throw Error('No canvas found - failed to draw zones');

    ctx.clearRect(0, 0, this.mapData.width, this.mapData.height);

    this.drawZone(ctx, this.mapData.loadingZone);
    this.drawZone(ctx, this.mapData.dumpingZone);
  }
}
