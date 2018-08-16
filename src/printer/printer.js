import normalizeCSS from 'normalize.css/normalize.css'
import printerCSS from './style.less'
import React from 'react'
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

function addPageSizeStyle (rule) {
  insertCSS(`@page {size: ${rule}; }`)
}

const Header = (props) => (<Panel {...props} panel='header' placeholder='页眉'/>)
const Top = (props) => (<Panel {...props} panel='top' placeholder='页头'/>)
const Bottom = (props) => (<Panel {...props} panel='bottom' placeholder='页尾'/>)
const Footer = (props) => (<Panel {...props} panel='footer' placeholder='页脚'/>)

@observer
class Printer extends React.Component {
  constructor (props) {
    super(props)

    printerStore.init()

    const {type, size, gap} = props.config.page
    if (_.isString(type)) {
      printerStore.setSize(type)
      printerStore.setGap(type)
    } else {
      printerStore.setSize(size)
      printerStore.setGap(gap)
    }

    printerStore.setData(props.data)
    printerStore.setTableData(props.tableData)

    if (type) {
      addPageSizeStyle(type)
    } else {
      addPageSizeStyle(`${size.width} ${size.height}`)
    }

    printerStore.setSelected(props.selected)
  }

  componentDidUpdate () {
    printerStore.setSelected(this.props.selected)
  }

  componentDidMount () {
    printerStore.setReady(true)

    printerStore.setPage()
  }

  renderBefore () {
    const {config, tableData} = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        <Top config={config.top} pageIndex={0}/>
        <Table config={config.table} data={tableData}/>
        <Bottom config={config.bottom} pageIndex={0}/>
        <Footer config={config.footer} pageIndex={0}/>
      </Page>
    )
  }

  renderOnePage () {
    const {config, tableData} = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        <Top config={config.top} pageIndex={0}/>
        <Table config={config.table} data={tableData}/>
        <Bottom config={config.bottom} pageIndex={0}/>
        <Footer config={config.footer} pageIndex={0}/>
      </Page>
    )
  }

  renderMorePage () {
    const {
      config, tableData
    } = this.props

    return (
      <React.Fragment>
        {_.map(printerStore.page, (p, i) => {
          if (p.bottomPage) {
            return (
              <Page key={i} pageIndex={i}>
                <Header config={config.header} pageIndex={i}/>
                <Bottom config={config.bottom} style={{bottom: config.footer.style.height}} pageIndex={i}/>
                <Footer config={config.footer} pageIndex={i}/>
              </Page>
            )
          }

          return (
            <Page key={i} pageIndex={i}>
              <Header config={config.header} pageIndex={i}/>
              {i === 0 && <Top config={config.top} pageIndex={i}/>}
              <Table config={config.table} data={tableData.slice(p.begin, p.end)}/>
              {i === (printerStore.page.length - 1) &&
              <Bottom config={config.bottom} pageIndex={i} style={{bottom: config.footer.style.height}}/>}
              <Footer config={config.footer} pageIndex={i}/>
            </Page>
          )
        })}
      </React.Fragment>
    )
  }

  renderPage () {
    const pageLength = printerStore.page.length
    if (pageLength === 1) {
      return this.renderOnePage()
    } else {
      return this.renderMorePage()
    }
  }

  render () {
    return (
      <div className='gm-printer' style={{
        width: printerStore.size.width
      }}>
        {printerStore.ready ? this.renderPage() : this.renderBefore()}
      </div>
    )
  }
}

Printer.propTypes = {
  selected: PropTypes.string,
  data: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired
}

export default Printer
