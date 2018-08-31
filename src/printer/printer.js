import normalizeCSS from 'normalize.css/normalize.css'
import printerCSS from './style.less'
import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import printerStore from './store'
import Page from './page'
import _ from 'lodash'
import Panel from './panel'
import Table from './table'
import { insertCSS } from '../util'

insertCSS(normalizeCSS.toString())
insertCSS(printerCSS.toString())

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

const Header = (props) => <Panel {...props} name='header' placeholder='页眉'/>
const Sign = (props) => <Panel {...props} style={{
  ...props.style,
  position: 'absolute',
  left: 0,
  right: 0
}} name='sign' placeholder='签名'/>
const Footer = (props) => <Panel {...props} style={{
  ...props.style,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
}} name='footer' placeholder='页脚'/>

@observer
class Printer extends React.Component {
  constructor (props) {
    super(props)

    printerStore.init(props.config, props.data)

    printerStore.setSelected(props.selected)
  }

  componentDidUpdate () {
    printerStore.setSelected(this.props.selected)
  }

  componentDidMount () {
    printerStore.setReady(true)

    printerStore.setPages()
  }

  renderBefore () {
    const {config} = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        {_.map(config.contents, (content, index) => {
          if (content.type === 'table') {
            const list = printerStore.data[content.dataKey] || printerStore.data.orders

            return <Table
              key={`contents.table.${index}`}
              name={`contents.table.${index}`}
              config={content}
              range={{begin: 0, end: list.length}}
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
      config
    } = this.props

    return (
      <React.Fragment>
        {_.map(printerStore.pages, (page, i) => {
          const isLastPage = i === printerStore.pages.length - 1

          return (
            <Page key={i} pageIndex={i}>
              <Header config={config.header} pageIndex={i}/>
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
                <Sign config={config.sign} pageIndex={i} style={{bottom: config.footer.style.height}}/>
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
      selected, data, config, //eslint-disable-line
      className,
      style,
      ...rest
    } = this.props
    const {width} = printerStore.config.page.size

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
  config: PropTypes.object.isRequired
}

export default Printer
