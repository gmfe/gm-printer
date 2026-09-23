import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'mobx-react'
import { getStyleWithDiff } from '../util'

const withStore = store => WrapComponent =>
  class extends React.Component {
    static propTypes = {
      config: PropTypes.object,
      mockData: PropTypes.object,
      imageConfig: PropTypes.object
    }

    constructor(props) {
      super(props)
      this.store = store
      this.store.init(props.config, props.mockData)
      // 插入图片增强配置(电子签章):由业务侧 props 传入,不传为 null 保持旧行为
      this.store.imageConfig = props.imageConfig || null
    }

    componentDidMount() {
      window.document.addEventListener(
        'gm-printer-select',
        this.handlePrinterSelect
      )
      window.document.addEventListener(
        'gm-printer-select-region',
        this.handleSelectedRegion
      )
      window.document.addEventListener(
        'gm-printer-panel-style-set',
        this.handlePrinterPanelStyleSet
      )
      window.document.addEventListener(
        'gm-printer-block-style-set',
        this.handlePrinterBlockStyleSet
      )
      window.document.addEventListener(
        'gm-printer-block-text-set',
        this.handlePrinterBlockTextSet
      )
      window.document.addEventListener(
        'gm-printer-table-drag',
        this.handlePrinterTableDrag
      )
      window.document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
      window.document.removeEventListener(
        'gm-printer-select',
        this.handlePrinterSelect
      )
      window.document.removeEventListener(
        'gm-printer-select-region',
        this.handleSelectedRegion
      )
      window.document.removeEventListener(
        'gm-printer-panel-style-set',
        this.handlePrinterPanelStyleSet
      )
      window.document.removeEventListener(
        'gm-printer-block-style-set',
        this.handlePrinterBlockStyleSet
      )
      window.document.removeEventListener(
        'gm-printer-block-text-set',
        this.handlePrinterBlockTextSet
      )
      window.document.removeEventListener(
        'gm-printer-table-drag',
        this.handlePrinterTableDrag
      )
      window.document.removeEventListener('keydown', this.handleKeyDown)
    }

    handleSelectedRegion = e => {
      const { selected } = e.detail
      this.store.setSelectedRegion(selected)
    }

    handlePrinterSelect = e => {
      const { selected } = e.detail
      this.store.setSelected(selected)
    }

    handlePrinterPanelStyleSet = e => {
      const { name, style } = e.detail
      // 配送单，清空空白数据
      !!this.store.clearAllTableEmptyData && this.store.clearAllTableEmptyData()
      this.store.setConfigPanelStyle(name, style)
    }

    handlePrinterBlockStyleSet = e => {
      const { style } = e.detail
      this.store.setConfigBlockBy('style', style)
    }

    handlePrinterBlockTextSet = e => {
      const { text } = e.detail
      this.store.setConfigBlockBy('text', text)
    }

    handlePrinterTableDrag = e => {
      this.store.exchangeTableColumn(e.detail.target, e.detail.source)
    }

    handleKeyDown = e => {
      if (e.target !== window.document.body) {
        return
      }

      if (e.code.startsWith('Arrow')) {
        e.preventDefault()

        if (this.store.computedIsSelectBlock) {
          let diffX = 0
          let diffY = 0

          if (e.code === 'ArrowLeft') {
            diffX -= 1
          } else if (e.code === 'ArrowUp') {
            diffY -= 1
          } else if (e.code === 'ArrowRight') {
            diffX += 1
          } else if (e.code === 'ArrowDown') {
            diffY += 1
          }

          const newStyle = getStyleWithDiff(
            this.store.computedSelectedInfo.style,
            diffX,
            diffY
          )

          this.store.setConfigBlockBy('style', newStyle)
        } else if (this.store.computedIsSelectTable) {
          if (e.code === 'ArrowLeft') {
            this.store.exchangeTableColumnByDiff(-1)
          } else if (e.code === 'ArrowRight') {
            this.store.exchangeTableColumnByDiff(1)
          }
        }
      } else if (e.code === 'Escape' && this.store.selected) {
        e.preventDefault()
        this.store.setSelected(null)
      } else if (e.code === 'Backspace' && this.store.selected) {
        e.preventDefault()
        this.store.removeField()
      }
    }

    render() {
      return (
        <Provider editStore={this.store} mockData={this.props.mockData}>
          <WrapComponent {...this.props} />
        </Provider>
      )
    }
  }
export default withStore
