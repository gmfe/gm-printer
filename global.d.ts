declare module 'gm-printer' {
  import { CSSProperties } from 'react'
  interface EditorProps {
    config: any
    mockData: any
    onSave: (config: any, isSaveAs?: boolean) => void
    showEditor: boolean
    addFields: any
  }
  interface PrinterProps {
    data: any
    config: any
    className?: string
    style?: CSSProperties
    selected?: string
    selectedRegion?: string
    onReady?: () => void
  }
  interface BatchPrinterProps {
    list: any[]
    onReady?: () => void
  }
  // function Editor<P extends EditorProps>(props: P): React.ComponentType<P>
  class Editor<T extends EditorProps> extends React.Component<T, any> {}
  class EditorStockIn<T extends EditorProps> extends React.Component<T, any> {}
  class EditorStockOut<T extends EditorProps> extends React.Component<T, any> {}
  class EditorPurchase<T extends EditorProps> extends React.Component<T, any> {}
  class EditorSettle<T extends EditorProps> extends React.Component<T, any> {}
  class EditorStatement<T extends EditorProps> extends React.Component<
    T,
    any
  > {}
  class EditorAccoutStatement<T extends EditorProps> extends React.Component<
    T,
    any
  > {}
  class EditorBoxLabel<T extends EditorProps> extends React.Component<T, any> {}
  class Printer<T extends PrinterProps> extends React.Component<T, any> {}
  class BatchPrinter<T extends BatchPrinterProps> extends React.Component<T, any> {}
  const MULTI_SUFFIX: string
  function getCSS(): string
  function insertCSS(cssString: string, target?: HTMLElement | ShadowRoot): void
  function doPrint(
    obj: { data: any; config: any },
    isTest?: boolean
  ): (obj: { data: any; config: any }) => Promise<any>
  function doBatchPrint(list: any [], isTest?: boolean): (list: []) => Promise<any>
  export {
    Editor,
    EditorStockIn,
    EditorStockOut,
    EditorPurchase,
    EditorSettle,
    EditorStatement,
    EditorAccoutStatement,
    EditorBoxLabel,
    Printer,
    BatchPrinter,
    MULTI_SUFFIX,
    insertCSS,
    getCSS,
    doPrint,
    doBatchPrint
  }
}
