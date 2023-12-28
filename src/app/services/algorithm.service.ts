import { Injectable } from '@angular/core';
import { Grid } from '../types/grid';
import { Point } from '../types/point';
import { PathNode } from '../types/path-node';
import { CurrentNode } from '../types/current-node';
import { NodeState } from '../types/node-state';

const DIRECT_COST = 10;
const DIAGONAL_COST = 14;

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  find_path_dijkstra(grid: Grid, start: Point, end: Point): PathNode | null {
    let open_list: PathNode[] = [];
    let closed_list: PathNode[] = [];
    let current_node: CurrentNode;

    this.add_node_to_open_list(
      open_list,
      this.create_node(start.x, start.y, 0, null),
      grid
    );

    const interval = setInterval(() => {
      if (
        current_node !== undefined &&
        current_node.node !== null &&
        current_node.index !== null
      ) {
        open_list.splice(current_node.index, 1);
        this.add_node_to_closed_list(closed_list, current_node.node, grid);
      }

      if (open_list.length === 0) {
        clearInterval(interval);
        return null;
      }

      current_node = this.get_node_with_lowest_f_score(open_list);
      this.set_node_state(grid, current_node.node!.point, NodeState.CURRENT);
      grid.steps++;

      if (current_node.node === null || current_node.index === null) {
        clearInterval(interval);
        return null;
      }

      if (this.is_coordinates_matching(current_node.node.point, end)) {
        let next: PathNode | null = current_node.node;
        while (next !== null) {
          this.set_node_state(grid, next.point, NodeState.PATH);
          next = next.next;
        }

        clearInterval(interval);
        return current_node.node;
      }

      const neighbors: PathNode[] = this.get_neighbors(
        grid,
        current_node.node,
        closed_list,
        end
      );

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        neighbor.f = neighbor.g;
        neighbor.h = null;

        const existing_node = open_list.find((node) =>
          this.is_coordinates_matching(node.point, neighbor.point)
        );

        if (existing_node !== undefined) {
          if (existing_node.g > neighbor.g) {
            existing_node.g = neighbor.g;
            existing_node.f = existing_node.g + (existing_node.h ?? 0);
            existing_node.next = current_node.node;
          }
        } else {
          open_list.push(neighbor);
          this.set_node_state(grid, neighbor.point, NodeState.OPEN);
        }

        grid.nodes[neighbor.point.y][neighbor.point.x].g = neighbor.g;
        grid.nodes[neighbor.point.y][neighbor.point.x].f = neighbor.f;
      }

      return null;
    }, 200);

    return null;
  }

  find_path_a_star(grid: Grid, start: Point, end: Point): PathNode | null {
    let open_list: PathNode[] = [];
    let closed_list: PathNode[] = [];
    let current_node: CurrentNode;

    this.add_node_to_open_list(
      open_list,
      this.create_node(start.x, start.y, 0, this.get_heuristics(start, end)),
      grid
    );

    const interval = setInterval(() => {
      if (
        current_node !== undefined &&
        current_node.node !== null &&
        current_node.index !== null
      ) {
        open_list.splice(current_node.index, 1);
        this.add_node_to_closed_list(closed_list, current_node.node, grid);
      }

      if (open_list.length === 0) {
        clearInterval(interval);
        return null;
      }

      current_node = this.get_node_with_lowest_f_score(open_list);
      this.set_node_state(grid, current_node.node!.point, NodeState.CURRENT);
      grid.steps++;

      if (current_node.node === null || current_node.index === null) {
        clearInterval(interval);
        return null;
      }

      if (this.is_coordinates_matching(current_node.node.point, end)) {
        let next: PathNode | null = current_node.node;
        while (next !== null) {
          this.set_node_state(grid, next.point, NodeState.PATH);
          next = next.next;
        }

        clearInterval(interval);
        return current_node.node;
      }

      const neighbors: PathNode[] = this.get_neighbors(
        grid,
        current_node.node,
        closed_list,
        end
      );

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        const existing_node = open_list.find((node) =>
          this.is_coordinates_matching(node.point, neighbor.point)
        );

        if (existing_node !== undefined) {
          if (existing_node.g > neighbor.g) {
            existing_node.g = neighbor.g;
            existing_node.h = neighbor.h;
            existing_node.f = existing_node.g + (existing_node.h ?? 0);
            existing_node.next = current_node.node;
          }
        } else {
          open_list.push(neighbor);
          this.set_node_state(grid, neighbor.point, NodeState.OPEN);
        }

        grid.nodes[neighbor.point.y][neighbor.point.x].g = neighbor.g;
        grid.nodes[neighbor.point.y][neighbor.point.x].h = neighbor.h;
        grid.nodes[neighbor.point.y][neighbor.point.x].f = neighbor.f;
      }

      return null;
    }, 200);

    return null;
  }

  private create_node(
    x: number,
    y: number,
    g: number,
    h: number | null = null,
    next: PathNode | null = null
  ): PathNode {
    return {
      point: { x, y },
      next,
      g,
      h,
      f: g + (h ?? 0),
    } satisfies PathNode;
  }

  private get_heuristics(start: Point, end: Point): number {
    const dx = Math.abs(start.x - end.x);
    const dy = Math.abs(start.y - end.y);

    return Math.min(dx, dy) * DIAGONAL_COST + Math.abs(dx - dy) * DIRECT_COST;
  }

  public set_node_state(grid: Grid, point: Point, state: NodeState) {
    grid.nodes[point.y][point.x].state = state;
  }

  private add_node_to_open_list(list: PathNode[], node: PathNode, grid: Grid) {
    list.push(node);
    this.set_node_state(grid, node.point, NodeState.OPEN);
  }

  private add_node_to_closed_list(
    list: PathNode[],
    node: PathNode,
    grid: Grid
  ) {
    list.push(node);
    this.set_node_state(grid, node.point, NodeState.CLOSED);
  }

  private get_node_with_lowest_f_score(list: PathNode[]): CurrentNode {
    let lowest_f_score = list[0];
    let lowest_f_score_index = 0;

    for (let i = 1; i < list.length; i++) {
      if (list[i].f < lowest_f_score.f) {
        lowest_f_score = list[i];
        lowest_f_score_index = i;
      }
    }

    return { node: lowest_f_score, index: lowest_f_score_index };
  }

  private is_coordinates_matching(point_one: Point, point_two: Point): boolean {
    return point_one.x === point_two.x && point_one.y === point_two.y;
  }

  private get_neighbors(
    grid: Grid,
    current_node: PathNode,
    closed_list: PathNode[],
    end_point: Point
  ): PathNode[] {
    let neighbors: PathNode[] = [];
    let neighbor: PathNode | null;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) {
          continue;
        }

        const point = {
          x: current_node.point.x + x,
          y: current_node.point.y + y,
        } satisfies Point;

        if (
          point.x < 0 ||
          point.x >= grid.nodes[0].length ||
          point.y < 0 ||
          point.y >= grid.nodes.length
        ) {
          continue;
        }

        if (grid.nodes[point.y][point.x].blocked) {
          continue;
        }

        if (
          closed_list.find(
            (node) => node.point.x == point.x && node.point.y == point.y
          ) !== undefined
        ) {
          continue;
        }

        const g = x == 0 || y == 0 ? DIRECT_COST : DIAGONAL_COST;

        neighbor = this.create_node(
          point.x,
          point.y,
          current_node.g + g,
          this.get_heuristics(point, end_point),
          current_node
        );

        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }
}
