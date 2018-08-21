import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { getHeight, getWidth } from './util'
import printerStore from './store'
import { observer } from 'mobx-react/index'
import classNames from 'classnames'

@observer
class TableBefore extends React.Component {
  componentDidMount () {
    const {tableData} = this.props

    const $table = ReactDOM.findDOMNode(this)
    const tHead = $table.querySelector('thead')
    const ths = tHead.querySelectorAll('th')
    const trs = $table.querySelectorAll('tbody tr')

    printerStore.setHeight({
      table: getHeight($table)
    })

    printerStore.setTable({
      data: tableData,
      head: {
        height: getHeight(tHead),
        widths: _.map(ths, th => getWidth(th))
      },
      body: {
        heights: _.map(trs, tr => getHeight(tr))
      }
    })
  }

  render () {
    const {columns, tableData, data, className} = this.props

    return (
      <table className={classNames('gm-printer-table', className)}>
        <thead>
          <tr>
            {_.map(columns, (col, i) => <th key={i} style={col.headStyle}>{col.head}</th>)}
          </tr>
        </thead>
        <tbody>
          {_.map(tableData, (d, i) => (
            <tr key={i}>
              {_.map(columns, (col, j) => (
                <td
                  style={col.style}
                  key={j}
                >{printerStore.templateTable(col.text, i, tableData, data)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

class TableReady extends React.Component {
  render () {
    const {columns, tableData, className, data} = this.props

    if (tableData.length === 0) {
      return null
    }

    return (
      <table className={classNames('gm-printer-table', className)}>
        <thead>
          <tr>
            {_.map(columns, (col, i) => <th key={i} style={Object.assign({}, col.headStyle, {
              width: printerStore.table.head.widths[i]
            })}>{col.head}</th>)}
          </tr>
        </thead>
        <tbody>
          {_.map(tableData, (d, i) => (
            <tr key={i}>
              {_.map(columns, (col, j) => (
                <td
                  style={col.style}
                  key={j}
                >{printerStore.templateTable(col.text, i, tableData, data)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

class Table extends React.Component {
  render () {
    const {columns, tableData, data, className} = this.props

    return (
      <div>
        {printerStore.ready ? <TableReady columns={columns} tableData={tableData} data={data} className={className}/>
          : <TableBefore columns={columns} data={data} tableData={tableData} className={className}/>}
      </div>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired
}

Table.defaultProps = {}

export default Table
