import React from 'react'
import ReactDOM from 'react-dom'
import Printer from './printer'
import getCSS from './get_css'
import BatchPrinter from './batch_printer'
import BatchFinancePrinter from '../finance_voucher/components/finance_batch_printer'
import { afterImgAndSvgLoaded } from '../util'

const printerId = '_gm-printer_' + Math.random()
let $printer = window.document.getElementById(printerId)
/**
 * @param {boolean} isTest 是否test
 * @param {boolean} isTipZoom zoom的时候是否提示
 */
function init({ isTest, isTipZoom = true } = {}) {
  // isTipZoom &&
  //   isZoom() &&
  //   window.alert(
  //     '检测您的浏览器使用了缩放,为了避免影响打印布局,请重置缩放到100%后再进行打印'
  //   )
  if (!$printer) {
    $printer = window.document.createElement('iframe')
    $printer.id = printerId
    $printer.style.position = 'fixed'
    $printer.style.top = '0'
    $printer.style.width = '100%' // 使移动端可滚动
    if (isTest) {
      // 模板编辑[测试打印],隐藏起来
      $printer.style.left = '-2000px'
    } else {
      $printer.style.left = '0px'
      $printer.style.height = '100vh'
    }
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

function toDoPrint({ data, config }, isSomeSubtotalTr) {
  return new window.Promise(resolve => {
    const $app = $printer.contentWindow.document.getElementById('appContainer')
    ReactDOM.unmountComponentAtNode($app)
    ReactDOM.render(
      <Printer
        isSomeSubtotalTr={isSomeSubtotalTr} // 每页合计是否需要展示多个字段
        config={config}
        data={data}
        onReady={() => {
          afterImgAndSvgLoaded(() => {
            $printer.contentWindow.print()
            resolve()
          }, $app)
        }}
      />,
      $app
    )
  })
}

function toDoPrintBatch(list, isPrint = true) {
  return new window.Promise(resolve => {
    const $app = $printer.contentWindow.document.getElementById('appContainer')
    // 获取模版类型
    const templateType = list?.[0]?.config?.page?.type
    // 初始化
    ReactDOM.unmountComponentAtNode($app)
    ReactDOM.render(
      <BatchPrinter
        list={list}
        onReady={() => {
          afterImgAndSvgLoaded(() => {
            isPrint &&
              templateType !== 'longPrint' &&
              $printer.contentWindow.print()
            resolve()
          }, $app)
        }}
      />,
      $app
    )
  })
}

function toDoPrintFinanceBatch(list, isPrint = true) {
  return new window.Promise(resolve => {
    const $app = $printer.contentWindow.document.getElementById('appContainer')
    ReactDOM.unmountComponentAtNode($app)
    ReactDOM.render(
      <BatchFinancePrinter
        list={list}
        onReady={() => {
          afterImgAndSvgLoaded(() => {
            isPrint && $printer.contentWindow.print()
            resolve()
          }, $app)
        }}
      />,
      $app
    )
  })
}

function doPrint({ data, config }, isTest, isSomeSubtotalTr) {
  init({ isTest })

  return toDoPrint({ data, config }, isSomeSubtotalTr)
}
function doBatchPrint(
  list,
  isTest,
  extraCofnig = { isPrint: true, isTipZoom: true }
) {
  init({ isTest, isTipZoom: extraCofnig.isTipZoom })

  return toDoPrintBatch(list, extraCofnig.isPrint)
}

function doBatchFinancePrint(
  list,
  isTest,
  extraCofnig = { isPrint: true, isTipZoom: true }
) {
  init({ isTest, isTipZoom: extraCofnig.isTipZoom })

  return toDoPrintFinanceBatch(list, extraCofnig.isPrint)
}

/**
 * @description: 获取打印的html
 */
function getPrintContainerHTML() {
  return $printer.contentWindow.document.getElementsByTagName('html')[0]
    .innerHTML
}

function setPrintStyle() {
  const doc = document
  const style = doc.createElement('style')
  style.appendChild(doc.createTextNode(getCSS()))
  doc.head.appendChild(style)
}
export {
  doPrint,
  doBatchPrint,
  getPrintContainerHTML,
  doBatchFinancePrint,
  setPrintStyle
}
