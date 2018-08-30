import React from 'react'
import ReactDOM from 'react-dom'
import Printer from './printer'
import BatchPrinter from './batch_printer'
import printerCSS from './style.less'

const printerId = '_gm-printer_' + Math.random()
let $printer = window.document.getElementById(printerId)

function init () {
  if (!$printer) {
    $printer = window.document.createElement('iframe')
    $printer.id = printerId
    $printer.style.position = 'fixed'
    $printer.style.top = '0'
    $printer.style.left = '-1200px'
    $printer.style.width = '1000px'

    window.document.body.appendChild($printer)

    const doc = $printer.contentWindow.document

    const style = doc.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(printerCSS.toString()))
    doc.head.appendChild(style)

    const div = doc.createElement('div')
    div.id = 'appContainer'

    doc.body.appendChild(div)
  }
}

function toDoPrint ({data, config}) {
  ReactDOM.render((
    <Printer
      config={config}
      data={data}
    />
  ), $printer.contentWindow.document.getElementById('appContainer'))
  $printer.contentWindow.print()
}

function toDoPrintBatch ({datas, config}) {
  ReactDOM.render((
    <BatchPrinter
      config={config}
      datas={datas}
    />
  ), $printer.contentWindow.document.getElementById('appContainer'))
  $printer.contentWindow.print()
}

function doPrint ({data, config}) {
  init()

  toDoPrint({data, config})
}

function doBatchPrint ({datas, config}) {
  init()

  toDoPrintBatch({datas, config})
}

export {
  doPrint,
  doBatchPrint
}
