import normalizeCSS from 'normalize.css/normalize.css'
import printerCSS from './style.less'
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Big from 'big.js'
import printerStore from './store'
import Page from './page'
import _ from 'lodash'
import Panel from './panel'
import { insertCSS } from '../util'
import { TABLETYPE_CATEGORY1TOTAL } from '../config'

insertCSS(normalizeCSS.toString())
insertCSS(printerCSS.toString())

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

function addPageSizeStyle (rule) {
  insertCSS(`@page {size: ${rule}; }`)
}

const Header = (props) => <Panel {...props} panel='header' placeholder='页眉'/>
const Sign = (props) => <Panel {...props} style={{
  ...props.style,
  position: 'absolute',
  left: 0,
  right: 0
}} panel='sign' placeholder='签名'/>
const Footer = (props) => <Panel {...props} style={{
  ...props.style,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
}} panel='footer' placeholder='页脚'/>

const Contents = props => _.map(props.contents, (content, index) => {
  return (
    <Panel
      key={`contents.${index}`}
      config={content}
      pageIndex={props.pageIndex}
      panel={`contents.${index}`}
      placeholder={`contents.${index}`}
    />
  )
})

@observer
class Printer extends React.Component {
  constructor (props) {
    super(props)

    printerStore.init(props.config)

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

    printerStore.setPages()
  }

  renderBefore () {
    const {config} = this.props

    return (
      <Page pageIndex={0}>
        <Header config={config.header} pageIndex={0}/>
        <Contents contents={config.contents} pageIndex={0}/>
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
              {_.map(page, panel => {
                return <Panel
                  key={`contents.${panel.index}`}
                  config={config.contents[panel.index]}
                  pageIndex={i}
                  panel={`contents.${panel.index}`}
                  placeholder={`contents.${panel.index}`}
                />
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
