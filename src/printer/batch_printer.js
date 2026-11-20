import React from 'react'
import Printer from './printer'
import _ from 'lodash'
import PropTypes from 'prop-types'

class BatchPrinter extends React.Component {
  constructor(props) {
    super(props)
    this.ready = 0
    /** 各单据 Printer 实例（WithStorePrinter，含 printerStore），供打印入口判断分页失败态 */
    this.printers = []
  }

  handleReady = () => {
    this.ready++
    if (this.ready === this.props.list.length) {
      // 失败信号随 onReady 下发（增量参数）：mesv2 等宿主自建 iframe 直接渲染
      // BatchPrinter、自取 innerHTML 发打印机（Electron ipc / 安卓 TSPL 蓝牙），
      // 不经过 doPrint/doBatchPrint 的打印入口拦截，据此在发送前判断：
      // 整批分页失败(paginationFailed)不发送；部分失败时失败单渲染为 null 不占 HTML
      const failedCount = this.printers.filter(
        p => p?.printerStore?.paginationFailed
      ).length
      this.props.onReady({
        paginationFailed:
          this.printers.length > 0 && failedCount === this.printers.length,
        failedCount
      })
    }
  }

  render() {
    const { list } = this.props
    this.printers = []

    return _.map(list, ({ config, data }, i) => (
      <Printer
        key={i}
        ref={ref => {
          if (ref) {
            this.printers[i] = ref
          }
        }}
        data={data}
        config={config}
        onReady={this.handleReady}
      />
    ))
  }
}

BatchPrinter.propTypes = {
  list: PropTypes.array.isRequired,
  onReady: PropTypes.func
}

BatchPrinter.defaultProps = {
  onReady: _.noop
}

export default BatchPrinter
