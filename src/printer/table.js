import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { getHeight, getWidth, dispatchMsg, getTableColumnName } from '../util'
import printerStore from './store'
import { observer } from 'mobx-react/index'
import classNames from 'classnames'

@observer
class Table extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: null
    }
  }

  componentDidMount () {
    const { name } = this.props

    if (!printerStore.ready) {
      const $table = ReactDOM.findDOMNode(this).querySelector('table')
      const tHead = $table.querySelector('thead')
      const ths = tHead.querySelectorAll('th') || []
      const trs = $table.querySelectorAll('tbody tr') || []

      printerStore.setHeight(name, getHeight($table))

      printerStore.setTable(name, {
        head: {
          height: getHeight(tHead),
          widths: _.map(ths, th => getWidth(th))
        },
        body: {
          heights: _.map(trs, tr => getHeight(tr))
        }
      })
    }
  }

  handleClick = (e) => {
    const { name } = this.props
    const { index } = e.target.dataset

    dispatchMsg('gm-printer-select', {
      selected: getTableColumnName(name, index)
    })
  }

  handleDragStart = (e) => {
    const { name } = this.props
    const { index } = e.target.dataset

    this.setState({
      index
    })

    dispatchMsg('gm-printer-select', {
      selected: getTableColumnName(name, index)
    })
  }

  handleDrop = (e) => {
    const { index } = e.target.dataset

    if (this.state.index !== index) {
      dispatchMsg('gm-printer-table-drag', {
        source: this.state.index,
        target: index
      })
    }
  }

  handleDragOver = (e) => {
    e.preventDefault()
  }

  renderDefault () {
    const { config: { columns, dataKey }, name, range, pageIndex } = this.props

    const tableData = printerStore.data._table[dataKey] || printerStore.data._table.orders

    return (
      <table>
        <thead>
          <tr>
            {_.map(columns, (col, i) => (
              <th
                key={i}
                data-index={i}
                data-name={getTableColumnName(name, i)}
                draggable
                style={Object.assign({}, col.headStyle)}
                className={classNames({
                  active: getTableColumnName(name, i) === printerStore.selected
                })}
                onClick={this.handleClick}
                onDragStart={this.handleDragStart}
                onDrop={this.handleDrop}
                onDragOver={this.handleDragOver}
              >{col.head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(_.range(range.begin, range.end), i => {
            const special = tableData[i]._special

            if (special) {
              return (
                <tr key={i}>
                  <td colSpan={99}>小计：{special.total}</td>
                </tr>
              )
            }
            return (
              <tr key={i}>
                {_.map(columns, (col, j) => (
                  <td
                    key={j}
                    data-name={getTableColumnName(name, i)}
                    style={col.style}
                    className={classNames({
                      active: getTableColumnName(name, j) === printerStore.selected
                    })}
                  >{printerStore.templateTable(col.text, dataKey, i, pageIndex)}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  render () {
    const { config: { className }, name, placeholder } = this.props

    return (
      <div
        className={classNames(
          'gm-printer-table',
          'gm-printer-table-classname-' + (className || 'default')
        )}
        data-name={name}
        data-placeholder={placeholder}
      >
        {this.renderDefault()}
      </div>
    )
  }
}

Table.propTypes = {
  config: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  range: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired
}

export default Table
