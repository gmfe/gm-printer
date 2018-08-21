import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { getHeight, getWidth } from './util'
import { observer } from 'mobx-react/index'
import classNames from 'classnames'

@observer
class TableBefore extends React.Component {
  componentDidMount () {
    const {tableData, store} = this.props

    const $table = ReactDOM.findDOMNode(this)
    const tHead = $table.querySelector('thead')
    const ths = tHead.querySelectorAll('th')
    const trs = $table.querySelectorAll('tbody tr')

    store.setHeight({
      table: getHeight($table)
    })

    store.setTable({
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
    const {columns, tableData, className, store} = this.props

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
                >{store.templateTable(col.text, i, tableData)}</td>
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
    const {columns, tableData, className, store} = this.props

    if (tableData.length === 0) {
      return null
    }

    return (
      <table className={classNames('gm-printer-table', className)}>
        <thead>
          <tr>
            {_.map(columns, (col, i) => <th key={i} style={Object.assign({}, col.headStyle, {
              width: store.table.head.widths[i]
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
                >{store.templateTable(col.text, i, tableData)}</td>
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
    const {columns, tableData, className, store} = this.props

    return (
      <div>
        {store.ready ? <TableReady columns={columns} store={store} tableData={tableData} className={className}/>
          : <TableBefore columns={columns} tableData={tableData} className={className} store={store}/>}
      </div>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired
}

Table.defaultProps = {}

export default Table
