type Dispose = () => void
type InsertCssItem = () => Dispose
type GetCSSItem = () => string
type GetContent = () => string

declare type Style = Record<string, string> & {
  _insertCss: InsertCssItem
  _getCss: GetCSSItem
  _getContent: GetContent
}

declare module '*.scss' {
  const style: Style
  export = style
}

declare module '*.css' {
  const style: Style
  export = style
}

declare module 'isomorphic-style-loader/withStyles' {
  const withStyles: (...styles: Style[]) => <T>(c: T) => T

  export = withStyles
}

declare module 'isomorphic-style-loader/StyleContext';
