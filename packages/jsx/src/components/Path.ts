import type { JSXElement, PathProps } from '../types';
import { Group } from './Group';

export function Path({ x, y, width, height, ...props }: PathProps): JSXElement {
  const node: JSXElement = {
    type: 'path',
    props,
  };

  // TODO scale path to fit width/height
  return Group({ x, y, width, height, children: [node] });
}
