import i18next from '../../locales'
import React from 'react'
import classNames from 'classnames'
import { inject, observer, Provider } from 'mobx-react'
import PropTypes from 'prop-types'
import PrinterStore from './store'
import Page from './page'
import _ from 'lodash'
import Panel from './panel'
import Table from './table'
import LongPrintTable from './long_print_table'
import MergePage from './merge_page'
import { LONG_PRINT } from '../config'
import Big from 'big.js'

// Header Sign Footer 相对特殊，要单独处理
const Header = props => (
  <Panel {...props} name='header' placeholder={i18next.t('页眉')} />
)

const Sign = props => (
  <Panel
    {...props}
    style={{
      ...props.style,
      position: props?.flag ? 'absolute' : 'relative',
      left: 0,
      right: 0
    }}
    name='sign'
    placeholder={i18next.t('签名')}
  />
)

Sign.propTypes = {
  style: PropTypes.object
}

const Footer = props => (
  <Panel
    {...props}
    style={{
      ...props.style,
      position: props?.flag ? 'absolute' : 'relative',
      bottom: 0,
      left: 0,
      right: 0
    }}
    name='footer'
    placeholder={i18next.t('页脚')}
  />
)

Footer.propTypes = {
  style: PropTypes.object
}

@inject('printerStore')
@observer
class Printer extends React.Component {
  constructor(props) {
    super(props)

    // 无实际意义，辅助 onReady，见 didMount
    this.state = {}
    this.init()
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.props.printerStore.setSelected(nextProps.selected)
    }
    if (nextProps.selectedRegion !== this.props.selectedRegion) {
      this.props.printerStore.setSelectedRegion(nextProps.selectedRegion)
    }

    if (
      nextProps.isAutoFilling !== this.props.isAutoFilling ||
      nextProps.fillIndex !== this.props.printerStore.fillIndex
    ) {
      // 连续打印计算导致死循环 所以这里做了判断 五年前的提交记录是这样写的 我跟着写 在componentDidMount里写了
      if (nextProps.config.batchPrintConfig == 2) {
        return
      }
      await this.props.printerStore.setAutofillConfig(nextProps.isAutoFilling)
      await this.props.printerStore.setFillIndex(nextProps.fillIndex)
      await this.props.printerStore.setData(nextProps.data)
      await this.props.printerStore.setReady(true)
      await this.props.printerStore.changeTableData()
      await this.props.printerStore.computedPages()
    }

    if (nextProps.lineheight !== this.props.lineheight) {
      await this.props.getremainpageHeight(
        this.props.printerStore.remainPageHeight
      )
    }
    if (nextProps.overallorder !== this.props.overallorder) {
      this.props.printerStore.setOverallOrder(nextProps.config)
    }
  }

  componentDidMount() {
    const { printerStore, config, getremainpageHeight } = this.props
    const batchPrintConfig = config.batchPrintConfig
    // 连续打印不需要计算
    if (batchPrintConfig !== 2) {
      // didMount 代表第一次渲染完成
      printerStore.setReady(true)
      printerStore.computedPages()
      if (config.autoFillConfig?.checked) {
        this.props.printerStore.setAutofillConfig(
          config.autoFillConfig?.checked || false
        )
        this.props.printerStore.setFillIndex(
          config.autoFillConfig?.fillIndex || false
        )
        printerStore.changeTableData()
      }
      // 开始计算，获取各种数据
      // 如果是自适应要先计算高度，在算出行数 不是自适应就先计算行数 在计算高度
      // 获取剩余空白高度，传到editor
      getremainpageHeight && getremainpageHeight(printerStore.remainPageHeight)
    }

    // Printer 不是立马就呈现出最终样式，有个过程。这个过程需要时间，什么 ready，不太清楚，估借 setState 来获取过程结束时刻
    this.setState({}, () => {
      this.props.onReady()
    })
  }

  init() {
    const { printerStore, config, data, selected, selectedRegion } = this.props
    printerStore.init(config, data)
    printerStore.setSelected(selected)
    printerStore.setSelectedRegion(selectedRegion)
  }

  renderBefore() {
    const { printerStore } = this.props
    const { config } = printerStore

    return (
      <Page>
        <Header config={config.header} pageIndex={0} />
        {_.map(config.contents, (content, index) => {
          switch (content.type) {
            case 'table':
              // eslint-disable-next-line no-case-declarations
              const list = printerStore.data._table[content.dataKey]
              return (
                <Table
                  key={`contents.table.${index}`}
                  name={`contents.table.${index}`}
                  config={content}
                  range={{ begin: 0, end: list?.length || 0 }}
                  pageIndex={0}
                  placeholder={`${i18next.t('区域')} ${index}`}
                />
              )

            default:
              return (
                <Panel
                  key={`contents.panel.${index}`}
                  name={`contents.panel.${index}`}
                  config={content}
                  pageIndex={0}
                  placeholder={`${i18next.t('区域')} ${index}`}
                />
              )
          }
        })}
        <Sign config={config.sign} pageIndex={0} />
        <Footer config={config.footer} pageIndex={0} />
      </Page>
    )
  }

  renderLongPage() {
    const { printerStore, isSomeSubtotalTr } = this.props
    const { config } = printerStore
    return (
      <Page>
        <Header config={config.header} pageIndex={0} />
        {_.map(config.contents, (content, index) => {
          switch (content.type) {
            case 'table':
              // eslint-disable-next-line no-case-declarations
              const list = printerStore.data._table[content.dataKey]
              // console.log(content, "content");
              if (content.className === 'specialTable') {
                return (
                  <LongPrintTable
                    key={`contents.table.${index}`}
                    name={`contents.table.${index}`}
                    config={content}
                    range={{ begin: 0, end: list?.length || 0 }}
                    pageIndex={0}
                    placeholder={`${i18next.t('区域')} ${index}`}
                  />
                )
              } else {
                return (
                  <Table
                    key={`contents.table.${index}`}
                    name={`contents.table.${index}`}
                    config={content}
                    range={{
                      begin: 0,
                      end: list?.length || 0
                    }}
                    placeholder={`${i18next.t('区域')} ${index}`}
                    pageIndex={0}
                    isSomeSubtotalTr={isSomeSubtotalTr}
                  />
                )
              }
            default:
              return (
                <Panel
                  key={`contents.panel.${index}`}
                  name={`contents.panel.${index}`}
                  config={content}
                  pageIndex={0}
                  placeholder={`${i18next.t('区域')} ${index}`}
                />
              )
          }
        })}
      </Page>
    )
  }

  renderPage() {
    const { printerStore, isSomeSubtotalTr } = this.props
    const { config, remainPageHeight, isAutoFilling } = printerStore
    return (
      <>
        {_.map(printerStore.pages, (page, i) => {
          const isLastPage = i === printerStore.pages.length - 1
          if (page.length === 0) {
            return null
          }
          return (
            <Page key={i}>
              <Header config={config.header} pageIndex={i} />
              {_.map(page, (panel, ii) => {
                const content = config.contents[panel.index]
                const autoFillConfig = config?.autoFillConfig || {}
                const isAutofillConfig =
                  isLastPage &&
                  isAutoFilling &&
                  panel.end &&
                  content?.dataKey === autoFillConfig?.dataKey
                const endList = isAutofillConfig
                  ? Math.floor(
                      remainPageHeight /
                        printerStore.computedTableCustomerRowHeight
                    )
                  : 0
                const end = +Big(panel?.end || 0).add(endList)

                switch (panel.type) {
                  case 'table':
                    return (
                      <Table
                        key={`contents.table.${panel.index}.${ii}`}
                        name={`contents.table.${panel.index}`}
                        config={content}
                        range={{
                          begin: panel.begin,
                          end: end
                        }}
                        placeholder={`${i18next.t('区域')} ${panel.index}`}
                        pageIndex={i}
                        isSomeSubtotalTr={isSomeSubtotalTr}
                      />
                    )

                  default:
                    return (
                      <Panel
                        key={`contents.panel.${panel.index}`}
                        name={`contents.panel.${panel.index}`}
                        config={config.contents[panel.index]}
                        pageIndex={i}
                        placeholder={`${i18next.t('区域')} ${panel.index}`}
                      />
                    )
                }
              })}
              {isLastPage && (
                <Sign
                  config={config.sign}
                  pageIndex={i}
                  style={{ bottom: config.footer.style.height }}
                  flag={isLastPage && config?.isFixLastFooter !== false}
                />
              )}
              <Footer
                config={config.footer}
                pageIndex={i}
                flag={isLastPage && config?.isFixLastFooter !== false}
              />
            </Page>
          )
        })}
      </>
    )
  }

  renderMerge() {
    const { printerStore } = this.props
    const { config } = printerStore

    return (
      <MergePage>
        <Header config={config.header} pageIndex={0} />
        {_.map(config.contents, (content, index) => {
          switch (content.type) {
            case 'table':
              // eslint-disable-next-line no-case-declarations
              const list = printerStore.data._table[content.dataKey]
              return (
                <Table
                  key={`contents.table.${index}`}
                  name={`contents.table.${index}`}
                  config={content}
                  range={{ begin: 0, end: list?.length || 0 }}
                  pageIndex={0}
                  placeholder={`${i18next.t('区域')} ${index}`}
                />
              )

            default:
              return (
                <Panel
                  key={`contents.panel.${index}`}
                  name={`contents.panel.${index}`}
                  config={content}
                  pageIndex={0}
                  placeholder={`${i18next.t('区域')} ${index}`}
                />
              )
          }
        })}
        <Sign config={config.sign} pageIndex={0} />
        <Footer config={config.footer} pageIndex={0} />
      </MergePage>
    )
  }

  doRender() {
    const { printerStore, config } = this.props
    // batchPrintConfig: 1 不连续打印（纸张会间断）2 连续打印（纸张连续打，不间断）
    const batchPrintConfig = config.batchPrintConfig
    if (config.page.type === LONG_PRINT) {
      return !printerStore.ready ? this.renderBefore() : this.renderLongPage()
    }
    if (batchPrintConfig === 2) {
      return this.renderMerge()
    } else {
      // renderBefore ，拿到各种数据，哪些模块哪些内容放合适位置，切割表格
      // renderPage，最终渲染打印的页面
      return !printerStore.ready ? this.renderBefore() : this.renderPage()
    }
  }

  render() {
    const {
      selected,
      config,
      onReady,
      selectedRegion,
      printerStore,
      ...rest
    } = this.props
    const {
      size: { width },
      className,
      style
    } = printerStore.config.page
    // batchPrintConfig: 1 不连续打印（纸张会间断）2 连续打印（纸张连续打，不间断）
    const batchPrintConfig = config.batchPrintConfig

    return (
      <div
        {...rest}
        className={classNames('gm-printer', className)}
        style={Object.assign({}, style, {
          width,
          breakAfter: batchPrintConfig === 2 ? 'auto' : 'always'
        })}
      >
        {this.doRender()}
      </div>
    )
  }
}

Printer.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
  printerStore: PropTypes.object,
  selected: PropTypes.string,
  selectedRegion: PropTypes.string,
  isAutoFilling: PropTypes.bool,
  fillIndex: PropTypes.number,
  lineheight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onReady: PropTypes.func,
  isSomeSubtotalTr: PropTypes.bool,
  getremainpageHeight: PropTypes.func,
  overallorder: PropTypes.bool
}

Printer.defaultProps = {
  onReady: _.noop
}

class WithStorePrinter extends React.Component {
  constructor(props) {
    super(props)
    this.printerStore = new PrinterStore()
  }

  render() {
    return (
      <Provider printerStore={this.printerStore}>
        <Printer {...this.props} />
      </Provider>
    )
  }
}

export default WithStorePrinter
