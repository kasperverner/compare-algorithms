import { NodeState } from './node-state';
import { Point } from './point';

export type Node = {
  point: Point;
  state: NodeState;
  blocked: boolean;
  g: number | null;
  h: number | null;
  f: number | null;
};
