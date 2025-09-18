import type { JSXElement, PolygonProps } from '../types';
import { Group } from './Group';

export function Polygon({
  x,
  y,
  width,
  height,
  points = [],
  ...props
}: PolygonProps): JSXElement {
  const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');

  const node: JSXElement = {
    type: 'polygon',
    props: {
      ...props,
      points: pointsStr,
    },
  };

  return Group({ x, y, width, height, children: [node] });
}
