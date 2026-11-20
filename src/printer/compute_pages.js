import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { toJS } from 'mobx'
import Printer from './printer'
import getCSS from './get_css'
import { afterImgAndSvgLoaded } from '../util'
import { LONG_PRINT } from '../config'

// 与 do_print.js 的容器隔离，使用独立 iframe，避免和打印任务互相 unmount 对方内容
const printerId = '_gm-printer-compute-pages_' + Math.random()
let $printer = null

/**
 * 初始化隐藏渲染容器
 * 复制自 do_print.js 的 init({ isTest: true }) 分支（iframe 创建 + getCSS 注入），
 * 差异仅 id 前缀与「永远隐藏」。⚠️ get_css / 容器初始化逻辑变更时两处需同步，
 * 否则测量环境与打印环境漂移，分页边界不再一致
 */
function init() {
  if (!$printer) {
    $printer = window.document.createElement('iframe')
    $printer.id = printerId
    $printer.style.position = 'fixed'
    $printer.style.top = '0'
    $printer.style.width = '100%'
    // 隐藏起来，用户不可见
    $printer.style.left = '-2000px'
    window.document.body.appendChild($printer)

    const idocument = $printer.contentDocument
    idocument.open()
    idocument.write('<!DOCTYPE html><html><head></head><body></body></html>')
    idocument.close()

    const doc = $printer.contentWindow.document

    const style = doc.createElement('style')
    style.appendChild(doc.createTextNode(getCSS()))
    doc.head.appendChild(style)

    const div = doc.createElement('div')
    div.id = 'appContainer'

    doc.body.appendChild(div)
  }
}

/**
 * 按打印分页逻辑计算分页结果（不触发打印）
 *
 * 场景：导出功能需要拿到与打印完全一致的分页边界
 *
 * 不支持的模板类型（返回空 pages，调用方需自行降级）：
 *   - batchPrintConfig === 2（合并打印）：componentDidMount 不跑 computedPages，pages 恒空
 *   - page.type === LONG_PRINT（长条打印）：走 renderLongPage 全量渲染，pages 不对应真实布局
 *
 * @param {Object}  options
 * @param {Object}  options.data             打印数据（结构同 doPrint 的 data，含 _table）
 * @param {Object}  options.config           模板配置（结构同 doPrint 的 config）
 * @param {boolean} [options.isSomeSubtotalTr] 每页合计是否展示多个字段（对齐 doPrint 第三参，
 *                                            影响合计行渲染与行高，进而影响分页边界）
 * @returns {Promise<{pages: Array, remainPageHeight: number, tableCustomerRowHeight: number}>}
 *          pages: [[{type, index, begin, end}, ...], ...] 对 data._table[contents[i].dataKey] 行号的切片
 *          remainPageHeight: 最后一页剩余高度（供行数填充换算）
 *          tableCustomerRowHeight: 表格行高（供行数填充换算）
 */
function computePages({ data, config, isSomeSubtotalTr }) {
  // 不支持的模板类型提前告警（不阻断，返回结果交由调用方降级处理）
  if (config.batchPrintConfig === 2 || config.page?.type === LONG_PRINT) {
    console.warn(
      '[gm-printer] computePages: 当前模板为合并打印或长条打印，computedPages 不生效，pages 将为空'
    )
  }

  return new window.Promise(resolve => {
    init()

    const $app = $printer.contentWindow.document.getElementById('appContainer')
    ReactDOM.unmountComponentAtNode($app)

    // computedPages 处理采购明细拆行时会原地 splice data._table，
    // 深拷贝一份，避免污染调用方数据
    const clonedData = _.cloneDeep(data)
    // computedPages 会往 config 顶层写 isSave（store.js），浅拷贝隔离开调用方的
    // template 对象（stationv2 导出时同一 template 跨多个 sheet 复用）
    const clonedConfig = { ...config }

    // 依赖 WithStorePrinter 实例字段 printerStore（printer.js）读取分页结果，
    // Printer 组件重构（store 挂载方式变化）时此处需同步
    let printerRef = null
    ReactDOM.render(
      <Printer
        ref={ref => {
          printerRef = ref
        }}
        isSomeSubtotalTr={isSomeSubtotalTr}
        config={clonedConfig}
        data={clonedData}
        onReady={() => {
          // onReady 触发时 componentDidMount 已同步执行完 computedPages()，pages 就绪
          // 模板含图片时等图片加载完成，避免图片撑高导致测量偏差
          afterImgAndSvgLoaded(() => {
            const store = printerRef.printerStore
            const result = {
              pages: toJS(store.pages),
              remainPageHeight: store.remainPageHeight,
              tableCustomerRowHeight: store.computedTableCustomerRowHeight
            }

            // 读取完成后卸载，避免 DOM 累积
            ReactDOM.unmountComponentAtNode($app)
            resolve(result)
          }, $app)
        }}
      />,
      $app
    )
  })
}

export { computePages }
