import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { getHeight, getWidth, dispatchMsg, getTableColumnName } from '../util'
import { TABLETYPE_CATEGORY1TOTAL } from '../config'
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
    const {data} = this.props

    const $table = ReactDOM.findDOMNode(this).querySelector('table')
    const tHead = $table.querySelector('thead')
    const ths = tHead.querySelectorAll('th') || []
    const trs = $table.querySelectorAll('tbody tr') || []

    printerStore.setHeight('table', getHeight($table))

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

  handleClick = (e) => {
    const {index} = e.target.dataset

    dispatchMsg('gm-printer-select', {
      selected: `table.column.${index}`
    })
  }

  handleDragStart = (e) => {
    const {index} = e.target.dataset

    this.setState({
      index
    })

    dispatchMsg('gm-printer-select', {
      selected: `table.column.${index}`
    })
  }

  handleDrop = (e) => {
    const {index} = e.target.dataset

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

  renderCategoryTotal () {
    const {config: {columns}, data} = this.props

    return (
      <table>
        <thead>
        <tr>
          {_.map(columns, (col, i) => (
            <th
              data-index={i}
              draggable
              key={i}
              style={Object.assign({}, col.headStyle, {
                width: printerStore.table.head.widths[i]
              })}
              className={classNames({
                active: getTableColumnName(i) === printerStore.selected
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
        {_.map(data, (d, i) => {
          const special = d._special

          if (special && special.type === TABLETYPE_CATEGORY1TOTAL) {
            return (
              <tr key={i}>
                <td colSpan={99}>小计：{special.data.total}</td>
              </tr>
            )
          }

          return (
            <tr key={i}>
              {_.map(columns, (col, j) => (
                <td
                  key={j}
                  style={col.style}
                  className={classNames({
                    active: getTableColumnName(j) === printerStore.selected
                  })}
                >{printerStore.templateTable(col.text, i, d)}</td>
              ))}
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }

  renderDefault () {
    const {config: {columns}, data} = this.props

    return (
      <table>
        <thead>
        <tr>
          {_.map(columns, (col, i) => (
            <th
              data-index={i}
              draggable
              key={i}
              style={Object.assign({}, col.headStyle, {
                width: printerStore.table.head.widths[i]
              })}
              className={classNames({
                active: getTableColumnName(i) === printerStore.selected
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
        {_.map(data, (d, i) => (
          <tr key={i}>
            {_.map(columns, (col, j) => (
              <td
                key={j}
                style={col.style}
                className={classNames({
                  active: getTableColumnName(j) === printerStore.selected
                })}
              >{printerStore.templateTable(col.text, i, d)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }

  render () {
    const {config: {type, className}} = this.props

    let content

    if (type === TABLETYPE_CATEGORY1TOTAL) {
      content = this.renderCategoryTotal()
    } else {
      content = this.renderDefault()
    }

    return (
      <div className={classNames(
        'gm-printer-table',
        'gm-printer-table-classname-' + (className || 'default'),
        'gm-printer-table-type-' + (type || 'default')
      )}>
        {content}
      </div>
    )
  }
}

Table.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
}

Table.defaultProps = {}

export default Table
