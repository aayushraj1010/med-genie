// Temporary JSX declaration to avoid editor/type errors when node_modules are not installed.
// Remove this file once dependencies are installed and @types/react is available.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
