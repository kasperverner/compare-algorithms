import { PathNode } from './path-node';

export type CurrentNode = {
  node: PathNode | null;
  index: number | null;
};
