import type { SVGAttributes } from 'react';
import type { JSXElement } from './jsx';

export interface BaseGeometryProps
  extends Omit<SVGAttributes<SVGElement>, 'children'> {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface FragmentProps {
  children?: JSXElement | JSXElement[];
}
export interface SVGProps extends BaseGeometryProps {
  children?: JSXElement | JSXElement[];
}
export interface DefsProps {
  children?: JSXElement | JSXElement[];
}
export interface GroupProps extends BaseGeometryProps {
  children?: JSXElement | JSXElement[];
}
export interface RectProps extends BaseGeometryProps {}
export interface EllipseProps extends BaseGeometryProps {}
export interface TextProps extends BaseGeometryProps {
  lineHeight?: number;
  wordWrap?: boolean;
  alignHorizontal?: 'left' | 'center' | 'right';
  alignVertical?: 'top' | 'center' | 'bottom';
  backgroundColor?: string;
  children?: string | number;
}
export interface PathProps extends BaseGeometryProps {}
export interface PolygonProps extends Omit<BaseGeometryProps, 'points'> {
  points?: [number, number][];
}
