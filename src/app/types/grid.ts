import { Algorithm } from "./algorithm";
import { Node } from "./node";

export type Grid = {
  algorithm: Algorithm;
  steps: number;
  nodes: Node[][];
};