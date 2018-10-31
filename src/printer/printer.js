import React from 'react'
import classNames from 'classnames'
import { observer, Provider, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import PrinterStore from './store'
import Page from './page'
import _ from 'lodash'
import Panel from './panel'
import Table from './table'
import Counter from './counter'

// Header Sign Footer 相对特殊，要单独处理
const Header = (props) => <Panel
  {...props}
  name='header'
  placeholder='页眉'
/>
const Sign = (props) => <Panel
  {...props}
  style={{
    ...props.style,
    position: 'absolute',
    left: 0,
    right: 0
  }}
  name='sign'
  placeholder='签名'
/>
const Footer = (props) => <Panel
  {...props}
  style={{
    ...props.style,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }}
  name='footer'
  placeholder='页脚'
/>

@inject('printerStore')
@observer
class Printer extends React.Component {
  constructor (props) {
    super(props)

    // 无实际意义，辅助 onReady，见 didMount
    this.state = {}

    props.printerStore.init(props.config, props.data)
    props.printerStore.setSelected(props.selected)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.props.printerStore.setSelected(nextProps.selected)
    }
  }

  componentDidMount () {
    const { printerStore } = this.props

    // didMount 代表第一次渲染完成
    printerStore.setReady(true)

    // 开始计算，获取各种数据
    printerStore.computedPages()

    // Printer 不是立马就呈现出最终样式，有个过程。这个过程需要时间，什么 ready，不太清楚，估借 setState 来获取过程结束时刻
    this.setState({}, () => {
      this.props.onReady()
    })
  }

  renderBefore () {
    const { config, printerStore } = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        <Counter config={config.counter} pageIndex={0}/>
        {_.map(config.contents, (content, index) => {
          if (content.type === 'table') {
            const list = printerStore.data._table[content.dataKey] || printerStore.data._table.orders

            return <Table
              key={`contents.table.${index}`}
              name={`contents.table.${index}`}
              config={content}
              range={{ begin: 0, end: list.length }}
              pageIndex={0}
              placeholder={`区域 ${index}`}
            />
          } else {
            return (
              <Panel
                key={`contents.panel.${index}`}
                name={`contents.panel.${index}`}
                config={content}
                pageIndex={0}
                placeholder={`区域 ${index}`}
              />
            )
          }
        })}
        <Sign config={config.sign} pageIndex={0}/>
        <Footer config={config.footer} pageIndex={0}/>
      </Page>
    )
  }

  renderPage () {
    const {
      config,
      printerStore
    } = this.props

    return (
      <React.Fragment>
        {_.map(printerStore.pages, (page, i) => {
          const isLastPage = i === printerStore.pages.length - 1
          const isFirstPage = i === 0

          return (
            <Page key={i} pageIndex={i}>
              <Header config={config.header} pageIndex={i}/>
              {isFirstPage && <Counter config={config.counter} pageIndex={i}/>}

              {_.map(page, (panel, ii) => {
                if (panel.type === 'table') {
                  return <Table
                    key={`contents.table.${panel.index}.${ii}`}
                    name={`contents.table.${panel.index}`}
                    config={config.contents[panel.index]}
                    range={{
                      begin: panel.begin,
                      end: panel.end
                    }}
                    placeholder={`区域 ${panel.index}`}
                    pageIndex={i}
                  />
                } else {
                  return (
                    <Panel
                      key={`contents.panel.${panel.index}`}
                      name={`contents.panel.${panel.index}`}
                      config={config.contents[panel.index]}
                      pageIndex={i}
                      placeholder={`区域 ${panel.index}`}
                    />
                  )
                }
              })}
              {isLastPage && (
                <Sign config={config.sign} pageIndex={i} style={{ bottom: config.footer.style.height }}/>
              )}
              <Footer config={config.footer} pageIndex={i}/>
            </Page>
          )
        })}
      </React.Fragment>
    )
  }

  render () {
    const {
      selected, data, config, onReady, //eslint-disable-line
      className,
      style,
      printerStore,
      ...rest
    } = this.props
    const { width } = printerStore.config.page.size

    // 第一个 renderBefore ，拿到各种数据，以便做计算，哪些模块哪些内容放合适位置
    return (
      <div
        {...rest}
        className={classNames('gm-printer', className)}
        style={Object.assign({}, style, {
          width
        })}
      >
        {printerStore.ready ? this.renderPage() : this.renderBefore()}
      </div>
    )
  }
}

Printer.propTypes = {
  selected: PropTypes.string,
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onReady: PropTypes.func
}

Printer.defaultProps = {
  onReady: _.noop
}

class WithStorePrinter extends React.Component {
  constructor (props) {
    super(props)
    this.printerStore = new PrinterStore()
  }

  render () {
    return (
      <Provider printerStore={this.printerStore}>
        <Printer {...this.props}/>
      </Provider>
    )
  }
}

export default WithStorePrinter
