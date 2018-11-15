import React from 'react'
import ReactDOM from 'react-dom'
import Printer from './printer'
import getCSS from './get_css'
import BatchPrinter from './batch_printer'

const printerId = '_gm-printer_' + Math.random()
let $printer = window.document.getElementById(printerId)

function init () {
  if (!$printer) {
    $printer = window.document.createElement('iframe')
    $printer.id = printerId
    $printer.style.position = 'fixed'
    $printer.style.top = '0'
    $printer.style.left = '-2000px'
    $printer.style.width = '1000px'

    window.document.body.appendChild($printer)

    const idocument = $printer.contentDocument
    idocument.open()
    idocument.write('<!DOCTYPE html><html><head></head><body></body></html>')
    idocument.close()

    const doc = $printer.contentWindow.document

    const style = doc.createElement('style')
    style.type = 'text/css'
    style.appendChild(doc.createTextNode(getCSS()))
    doc.head.appendChild(style)

    const div = doc.createElement('div')
    div.id = 'appContainer'

    doc.body.appendChild(div)
  }
}

function toDoPrint ({ data, config }) {
  return new window.Promise(resolve => {
    const $app = $printer.contentWindow.document.getElementById('appContainer')
    ReactDOM.unmountComponentAtNode($app)
    ReactDOM.render((
      <Printer
        config={config}
        data={data}
        onReady={() => {
          $printer.contentWindow.print()
          resolve()
        }}
      />
    ), $app)
  })
}

function toDoPrintBatch (list) {
  return new window.Promise(resolve => {
    const $app = $printer.contentWindow.document.getElementById('appContainer')
    ReactDOM.unmountComponentAtNode($app)
    ReactDOM.render((
      <BatchPrinter
        list={list}
        onReady={() => {
          $printer.contentWindow.print()
          resolve()
        }}
      />
    ), $app)
  })
}

function doPrint ({ data, config }) {
  init()

  return toDoPrint({ data, config })
}

function doBatchPrint (list) {
  init()

  toDoPrintBatch(list)
}

export {
  doPrint,
  doBatchPrint
}
