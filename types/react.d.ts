declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P) => ReactElement | null;
  export interface HTMLAttributes<T> {
    className?: string;
    style?: any;
    role?: string;
    'aria-label'?: string;
    children?: any;
    [key: string]: any;
  }
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: any) => ReactElement | null
  ): ((props: P & { ref?: any }) => ReactElement | null) & { displayName?: string };

  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    forwardRef: typeof forwardRef;
    [key: string]: any;
  };
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element extends any {}
}
