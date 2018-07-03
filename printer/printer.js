import React from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'
import printerStore from './store'
import Page from './page'
import _ from 'lodash'
import Top from './top'
import Bottom from './bottom'
import Header from './header'
import Footer from './footer'
import Fixed from './fixed'
import Table from './table'

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
  }

  componentDidMount () {
    printerStore.setReady(true)

    printerStore.setPage()
  }

  renderBefore () {
    const {config, tableData} = this.props

    return (
      <Page pageIndex={0}>
        <Header {...config.header} pageIndex={0}/>
        <Top {...config.top} pageIndex={0}/>
        <Table {...config.table} data={tableData}/>
        <Bottom {...config.bottom} pageIndex={0}/>
        <Footer {...config.footer} pageIndex={0}/>
        <Fixed {...config.fixed} pageIndex={0}/>
      </Page>
    )
  }

  renderOnePage () {
    const {config, tableData} = this.props

    return (
      <Page pageIndex={0}>
        <Header {...config.header} pageIndex={0}/>
        <Top {...config.top} pageIndex={0}/>
        <Table {...config.table} data={tableData}/>
        <Bottom {...config.bottom} pageIndex={0}/>
        <Footer {...config.footer} pageIndex={0}/>
        <Fixed {...config.fixed} pageIndex={0}/>
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
                <Header {...config.header} pageIndex={i}/>
                <Bottom {...config.bottom} pageIndex={i}/>
                <Footer {...config.footer} pageIndex={i}/>
                <Fixed {...config.fixed} pageIndex={i}/>
              </Page>
            )
          }

          return (
            <Page key={i} pageIndex={i}>
              <Header {...config.header} pageIndex={i}/>
              {i === 0 ? <Top {...config.top} pageIndex={i}/> : null}
              <Table {...config.table} data={tableData.slice(p.begin, p.end)}/>
              {i === (printerStore.page.length - 1) ? <Bottom {...config.bottom}/> : null}
              <Footer {...config.footer} pageIndex={i}/>
              <Fixed {...config.fixed} pageIndex={i}/>
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
  data: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired
}

export default Printer
