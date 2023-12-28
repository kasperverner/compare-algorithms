import { Injectable } from '@angular/core';
import { Point } from '../types/point';
import { NodeState } from '../types/node-state';
import { Grid } from '../types/grid';
import { Algorithm } from '../types/algorithm';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  GRID_SIZE = 10;
  BLOCKED_NODES: Point[] = [
    { x: 3, y: 0 },
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
    { x: 6, y: 4 },
    { x: 6, y: 5 },
    { x: 6, y: 6 },
    { x: 6, y: 7 },
    { x: 6, y: 8 },
    { x: 6, y: 9 },
  ];

  generate_grid(algorithm: Algorithm, has_blocked_nodes: boolean = true): Grid {
    const grid: Grid = {
      algorithm,
      nodes: [],
      steps: 0,
    };

    for (let y = 0; y < this.GRID_SIZE; y++) {
      grid.nodes[y] = [];
      for (let x = 0; x < this.GRID_SIZE; x++) {
        grid.nodes[y][x] = {
          point: { x, y },
          state: NodeState.PENDING,
          blocked: has_blocked_nodes ? this.is_node_blocked({ x, y }) : false,
          g: null,
          h: null,
          f: null,
        };
      }
    }

    return grid;
  }

  private is_node_blocked(point: Point): boolean {
    return this.BLOCKED_NODES
      .find((b_point) =>
        point.x === b_point.x
        && point.y === b_point.y
      ) !== undefined
  }
}
