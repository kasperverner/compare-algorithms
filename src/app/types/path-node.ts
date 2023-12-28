import { Point } from './point';

export type PathNode = {
  point: Point;
  next: PathNode | null;
  g: number;
  h: number | null;
  f: number;
};
