import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { getHeight, getWidth } from '../util'
import printerStore from './store'
import { observer } from 'mobx-react/index'
import classNames from 'classnames'

@observer
class TableBefore extends React.Component {
  componentDidMount () {
    const {data} = this.props

    const $table = ReactDOM.findDOMNode(this)
    const tHead = $table.querySelector('thead')
    const ths = tHead.querySelectorAll('th')
    const trs = $table.querySelectorAll('tbody tr')

    printerStore.setHeight({
      table: getHeight($table)
    })

    printerStore.setTable({
      data,
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
    const {columns, data} = this.props

    return (
      <table>
        <thead>
        <tr>
          {_.map(columns, (col, i) => <th key={i} style={col.headStyle}>{col.head}</th>)}
        </tr>
        </thead>
        <tbody>
        {_.map(data, (d, i) => (
          <tr key={i}>
            {_.map(columns, (col, j) => (
              <td
                style={col.style}
                key={j}
              >{printerStore.templateTable(col.text, i, data)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}

@observer
class TableReady extends React.Component {
  render () {
    const {columns, data} = this.props

    if (data.length === 0) {
      return null
    }

    return (
      <table>
        <thead>
        <tr>
          {_.map(columns, (col, i) => <th key={i} style={Object.assign({}, col.headStyle, {
            width: printerStore.table.head.widths[i]
          })}>{col.head}</th>)}
        </tr>
        </thead>
        <tbody>
        {_.map(data, (d, i) => (
          <tr key={i}>
            {_.map(columns, (col, j) => (
              <td
                style={col.style}
                key={j}
              >{printerStore.templateTable(col.text, i, data)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}

@observer
class Table extends React.Component {
  render () {
    const {columns, data, className} = this.props

    return (
      <div className={classNames('gm-printer-table', className)}>
        {printerStore.ready ? <TableReady columns={columns} data={data}/>
          : <TableBefore columns={columns} data={data}/>}
      </div>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
}

Table.defaultProps = {}

export default Table
