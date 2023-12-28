import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './services/grid.service';
import { AlgorithmService } from './services/algorithm.service';
import { Algorithm } from './types/algorithm';
import { GridComponent } from './components/grid/grid.component';
import { State } from './types/state';
import { NodeState } from './types/node-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridComponent],
  template: `
    <div class="min-h-screen p-16 flex flex-row gap-16">
      <div class="w-1/2">
        <app-grid [grid]="grid_one" />
      </div>
      <div class="w-1/2">
        <app-grid [grid]="grid_two" />
      </div>
    </div>
    @if (state === 0) {
    <div
      class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-40 flex flex-col justify-center items-center"
    >
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white text-3xl font-bold py-4 px-8 rounded"
        (click)="start()"
      >
        Find Path with blocked nodes
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white text-3xl font-bold py-4 px-8 mt-4 rounded"
        (click)="restart()"
      >
        Find Path without blocked nodes
      </button>
    </div>
    }
  `,
})
export class AppComponent {
  grid_service = inject(GridService);
  algorithm_service = inject(AlgorithmService);

  grid_one = this.grid_service.generate_grid(Algorithm.A_STAR);
  grid_two = this.grid_service.generate_grid(Algorithm.DIJKSTRA);
  state = State.PENDING;

  start() {
    this.state = State.RUNNING;

    this.grid_one.nodes[0][0].state = NodeState.START;
    this.grid_one.nodes[9][9].state = NodeState.END;

    this.grid_two.nodes[0][0].state = NodeState.START;
    this.grid_two.nodes[9][9].state = NodeState.END;

    this.algorithm_service.find_path_a_star(
      this.grid_one,
      { x: 0, y: 0 },
      { x: 9, y: 9 }
    );
    this.algorithm_service.find_path_dijkstra(
      this.grid_two,
      { x: 0, y: 0 },
      { x: 9, y: 9 }
    );

    this.state = State.FINISHED;
  }

  restart() {
    this.state = State.PENDING;

    this.grid_one = this.grid_service.generate_grid(Algorithm.A_STAR, false);
    this.grid_two = this.grid_service.generate_grid(Algorithm.DIJKSTRA, false);

    this.state = State.RUNNING;

    this.grid_one.nodes[0][0].state = NodeState.START;
    this.grid_one.nodes[9][9].state = NodeState.END;

    this.grid_two.nodes[0][0].state = NodeState.START;
    this.grid_two.nodes[9][9].state = NodeState.END;

    this.algorithm_service.find_path_a_star(
      this.grid_one,
      { x: 0, y: 0 },
      { x: 9, y: 9 }
    );
    this.algorithm_service.find_path_dijkstra(
      this.grid_two,
      { x: 0, y: 0 },
      { x: 9, y: 9 }
    );

    this.state = State.FINISHED;
  }
}
