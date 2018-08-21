import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
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
    const {store, config, data, tableData} = props

    store.init()

    const {type, size, gap} = config.page
    if (_.isString(type)) {
      store.setSize(type)
      store.setGap(type)
    } else {
      store.setSize(size)
      store.setGap(gap)
    }

    store.setData(data)
    store.setTableData(tableData)
  }

  componentDidMount () {
    const {store} = this.props
    store.setReady(true)

    store.setPage()
  }

  renderBefore () {
    const {config, tableData, store} = this.props

    return (
      <Page pageIndex={0} store={store}>
        <Header {...config.header} pageIndex={0} store={store}/>
        <Top {...config.top} pageIndex={0} store={store}/>
        <Table {...config.table} tableData={tableData} store={store}/>
        <Bottom {...config.bottom} pageIndex={0} store={store}/>
        <Footer {...config.footer} pageIndex={0} store={store}/>
        <Fixed {...config.fixed} pageIndex={0} store={store}/>
      </Page>
    )
  }

  renderOnePage () {
    const {config, tableData, store} = this.props

    return (
      <Page pageIndex={0} store={store}>
        <Header {...config.header} pageIndex={0} store={store}/>
        <Top {...config.top} pageIndex={0} store={store}/>
        <Table {...config.table} tableData={tableData} store={store}/>
        <Bottom {...config.bottom} pageIndex={0} store={store}/>
        <Footer {...config.footer} pageIndex={0} store={store}/>
        <Fixed {...config.fixed} pageIndex={0} store={store}/>
      </Page>
    )
  }

  renderMorePage () {
    const {
      config, tableData, store
    } = this.props

    return (
      <React.Fragment>
        {_.map(store.page, (p, i) => {
          if (p.bottomPage) {
            return (
              <Page key={i} pageIndex={i} store={store}>
                <Header {...config.header} pageIndex={i} store={store}/>
                <Bottom {...config.bottom} pageIndex={i} store={store}/>
                <Footer {...config.footer} pageIndex={i} store={store}/>
                <Fixed {...config.fixed} pageIndex={i} store={store}/>
              </Page>
            )
          }

          return (
            <Page key={i} pageIndex={i} store={store}>
              <Header {...config.header} pageIndex={i} store={store}/>
              {i === 0 ? <Top {...config.top} pageIndex={i} store={store}/> : null}
              <Table {...config.table} tableData={tableData.slice(p.begin, p.end)} store={store}/>
              {i === (store.page.length - 1) ? <Bottom {...config.bottom} store={store}/> : null}
              <Footer {...config.footer} pageIndex={i} store={store}/>
              <Fixed {...config.fixed} pageIndex={i} store={store}/>
            </Page>
          )
        })}
      </React.Fragment>
    )
  }

  renderPage () {
    const pageLength = this.props.store.page.length
    if (pageLength === 1) {
      return this.renderOnePage()
    } else {
      return this.renderMorePage()
    }
  }

  render () {
    const {store} = this.props
    return (
      <div className='gm-printer' style={{
        width: store.size.width
      }}>
        {store.ready ? this.renderPage() : this.renderBefore()}
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
