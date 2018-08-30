import normalizeCSS from 'normalize.css/normalize.css'
import printerCSS from './style.less'
import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Big from 'big.js'
import printerStore from './store'
import Page from './page'
import _ from 'lodash'
import Panel from './panel'
import Table from './table'
import { insertCSS } from '../util'
import { TABLETYPE_CATEGORY1TOTAL } from '../config'

insertCSS(normalizeCSS.toString())
insertCSS(printerCSS.toString())

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

function addPageSizeStyle (rule) {
  insertCSS(`@page {size: ${rule}; }`)
}

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

    printerStore.init(props.config)

    printerStore.setData(props.data)
    printerStore.setTableData(props.tableData)

    const {width, height} = printerStore.config.page.size
    addPageSizeStyle(`${width} ${height}`)

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
    const {config, tableData} = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        {_.map(config.contents, (content, index) => {
          if (content.type === 'table') {
            return <Table
              key={`contents.table.${index}`}
              name={`contents.table.${index}`}
              config={content}
              data={tableData}
              pageIndex={0}
            />
          } else {
            return (
              <Panel
                key={`contents.panel.${index}`}
                name={`contents.panel.${index}`}
                config={content}
                pageIndex={0}
                placeholder={`contents.panel.${index}`}
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
      tableData
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
                    data={tableData.slice(panel.begin, panel.end)}
                    columnIndex={panel.begin}
                    pageIndex={i}
                  />
                } else {
                  return (
                    <Panel
                      key={`contents.panel.${panel.index}`}
                      name={`contents.panel.${panel.index}`}
                      config={config.contents[panel.index]}
                      pageIndex={i}
                      placeholder={`contents.panel.${panel.index}`}
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
      selected, data, tableData, config, //eslint-disable-line
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
  tableData: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired
}

// @observer
// class Special extends React.Component {
//   render () {
//     const {config, data, tableData, ...rest} = this.props
//
//     const group = _.groupBy(tableData, v => v.category_title_1)
//
//     let newTableData = []
//
//     _.forEach(group, (value) => {
//       newTableData = newTableData.concat(value)
//
//       let total = Big(0)
//
//       _.each(value, v => (total = total.plus(v.sale_price)))
//
//       newTableData.push({
//         _special: {
//           type: TABLETYPE_CATEGORY1TOTAL,
//           data: {
//             total: total.valueOf()
//           }
//         }
//       })
//     })
//
//     return (
//       <Printer
//         config={config}
//         data={data}
//         tableData={newTableData}
//         {...rest}
//       />
//     )
//   }
// }

export default Printer
