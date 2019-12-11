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
import MergePage from './merge_page'

// Header Sign Footer 相对特殊，要单独处理
const Header = props => (
  <Panel {...props} name='header' placeholder={i18next.t('页眉')} />
)

const Sign = props => (
  <Panel
    {...props}
    style={{
      ...props.style,
      position: 'absolute',
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
      position: 'absolute',
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

    props.printerStore.init(props.config, props.data)
    props.printerStore.setSelected(props.selected)
    props.printerStore.setSelectedRegion(props.selectedRegion)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.props.printerStore.setSelected(nextProps.selected)
    }
    if (nextProps.selectedRegion !== this.props.selectedRegion) {
      this.props.printerStore.setSelectedRegion(nextProps.selectedRegion)
    }
  }

  componentDidMount() {
    const { printerStore, config } = this.props
    const batchPrintConfig = config.batchPrintConfig

    // 连续打印不需要计算
    if (batchPrintConfig !== 2) {
      // didMount 代表第一次渲染完成
      printerStore.setReady(true)

      // 开始计算，获取各种数据
      printerStore.computedPages()
    }
    // Printer 不是立马就呈现出最终样式，有个过程。这个过程需要时间，什么 ready，不太清楚，估借 setState 来获取过程结束时刻
    this.setState({}, () => {
      this.props.onReady()
    })
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
                  range={{ begin: 0, end: list.length }}
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

  renderPage() {
    const { printerStore } = this.props
    const { config } = printerStore

    return (
      <>
        {_.map(printerStore.pages, (page, i) => {
          const isLastPage = i === printerStore.pages.length - 1

          return (
            <Page key={i}>
              <Header config={config.header} pageIndex={i} />

              {_.map(page, (panel, ii) => {
                switch (panel.type) {
                  case 'table':
                    return (
                      <Table
                        key={`contents.table.${panel.index}.${ii}`}
                        name={`contents.table.${panel.index}`}
                        config={config.contents[panel.index]}
                        range={{
                          begin: panel.begin,
                          end: panel.end
                        }}
                        placeholder={`${i18next.t('区域')} ${panel.index}`}
                        pageIndex={i}
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
                />
              )}
              <Footer config={config.footer} pageIndex={i} />
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
                  range={{ begin: 0, end: list.length }}
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
      data,
      config,
      onReady,
      selectedRegion,
      className,
      style,
      printerStore,
      ...rest
    } = this.props
    const { width } = printerStore.config.page.size
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
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onReady: PropTypes.func
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
