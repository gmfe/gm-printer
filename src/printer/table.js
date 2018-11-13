import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { dispatchMsg, getHeight, getTableColumnName, getWidth } from '../util'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import Big from 'big.js'

@inject('printerStore')
@observer
class Table extends React.Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
    this.state = {
      index: null
    }
  }

  componentDidMount () {
    const { name, printerStore } = this.props

    if (!printerStore.ready) {
      const $table = this.ref.current.querySelector('table')
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

  handleSelectedRegion = () => {
    const { name } = this.props

    dispatchMsg('gm-printer-select-region', { selected: name })
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

  getColumns = () => {
    const { config: { columns, dataKey } } = this.props
    const arr = dataKey.split('_')

    const columns1 = columns.map((val, index) => ({ ...val, index }))
    // 多列表格
    if (arr.includes('multi')) {
      // 多列商品的第二列有点特殊,都带$2后缀
      const columns2 = columns.map((val, index) => {
        return {
          ...val,
          index,
          text: val.text.replace('}}', '') + '$2}}'
        }
      })
      return columns1.concat(columns2)
    } else {
      return columns1
    }
  }

  renderDefault () {
    const { config: { dataKey, subtotal }, name, range, pageIndex, printerStore } = this.props
    const tableData = printerStore.data._table[dataKey] || printerStore.data._table.orders

    // 每页小计
    let subtotalForEachPage = null
    if (subtotal.show && printerStore.ready) {
      const list = tableData.slice(range.begin, range.end)
      let sum = Big(0)
      _.each(list, ({ _origin = {}, _origin$2 = {} }) => {
        sum = sum.plus(_origin.real_item_price || 0)
        // 如果是多列
        if (_origin$2.real_item_price) {
          sum = sum.plus(_origin$2.real_item_price)
        }
      })

      subtotalForEachPage = <tr>
        <td colSpan={99} style={{ fontWeight: 'bold' }}>每页小计：{sum.toFixed(2)}</td>
      </tr>
    }

    const columns = this.getColumns()

    return (
      <table>
        <thead>
          <tr>
            {_.map(columns, (col, i) => (
              <th
                key={i}
                data-index={col.index}
                data-name={getTableColumnName(name, col.index)}
                draggable
                style={Object.assign({}, col.headStyle)}
                className={classNames({
                  active: getTableColumnName(name, col.index) === printerStore.selected
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
                  <td colSpan={99} style={{ fontWeight: 'bold' }}>{special.category_title_1}小计：{special.total}</td>
                </tr>
              )
            }

            return (
              <tr key={i}>
                {_.map(columns, (col, j) => (
                  <td
                    key={j}
                    data-name={getTableColumnName(name, col.index)}
                    style={col.style}
                    className={classNames({
                      active: getTableColumnName(name, col.index) === printerStore.selected
                    })}
                  >{printerStore.templateTable(col.text, dataKey, i, pageIndex)}</td>
                ))}
              </tr>
            )
          })}
          {subtotalForEachPage}
        </tbody>
      </table>
    )
  }

  render () {
    const { config: { className }, name, placeholder, printerStore } = this.props
    const active = printerStore.selectedRegion === name

    return (
      <div
        ref={this.ref}
        className={classNames(
          'gm-printer-table',
          'gm-printer-table-classname-' + (className || 'default'),
          { active }
        )}
        data-name={name}
        data-placeholder={placeholder}
        onClick={this.handleSelectedRegion}
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
