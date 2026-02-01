declare module '*.mermaid?raw' {
  const content: string;
  export default content;
}

declare module '*.mermaid' {
  const content: string;
  export default content;
}
