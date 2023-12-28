import { Component, Input } from '@angular/core';
import { Grid } from '../../types/grid';
import { CommonModule } from '@angular/common';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, NodeComponent],
  template: `
    <p class="font-bold text-4xl mb-2 pl-2">
      @switch (grid.algorithm)
      {
        @case (0) { A* Algorithm }
        @case (1) { Dijkstra's Algorithm }
      }
      <span class="text-2xl font-normal ml-2">({{ grid.steps }} steps)</span>
    </p>
    <div class="grid grid-cols-10 gap-1">
      @for (row of grid.nodes; track $index)
      {
        @for (col of row; track $index)
        {
          <app-node [node]="col" />
        }
      }
    </div>
  `,
})
export class GridComponent {
  @Input({ required: true }) grid!: Grid;
}
