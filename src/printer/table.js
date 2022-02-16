import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  dispatchMsg,
  getDataKey,
  getHeight,
  getMultiNumber,
  getTableColumnName,
  getWidth,
  isMultiTable
} from '../util'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { MULTI_SUFFIX } from '../config'
import SpecialTr from './table_special_tr'
import SubtotalTr from './table_subtotal_tr'
import PageSummary from './page_summary'

@inject('printerStore')
@observer
class Table extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.state = {
      index: null
    }
  }

  componentDidMount() {
    const { name, printerStore } = this.props

    if (!printerStore.ready) {
      const $table = this.ref.current.querySelector('table')
      const tHead = $table.querySelector('thead')
      const ths = tHead.querySelectorAll('th') || []
      const trs = $table.querySelectorAll('tbody tr') || []
      const detailsDiv = $table.querySelectorAll('tr td .b-table-details')

      printerStore.setHeight(name, getHeight($table))

      printerStore.setTable(name, {
        head: {
          height: getHeight(tHead),
          widths: _.map(ths, th => getWidth(th))
        },
        body: {
          heights: _.map(trs, tr => getHeight(tr)),
          children: _.map(detailsDiv, div => getHeight(div))
        }
      })
    }
  }

  handleClick = e => {
    const { name } = this.props
    const { index } = e.target.dataset

    dispatchMsg('gm-printer-select', {
      selected: getTableColumnName(name, index)
    })
  }

  handleDragStart = e => {
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

  handleDrop = e => {
    const { index } = e.target.dataset

    if (this.state.index !== index) {
      dispatchMsg('gm-printer-table-drag', {
        source: this.state.index,
        target: index
      })
    }
  }

  handleDragOver = e => {
    e.preventDefault()
  }

  getColumns = () => {
    const {
      config: { columns, dataKey }
    } = this.props
    const columns1 = columns.map((val, index) => ({ ...val, index }))
    // 如果是多列表格
    if (isMultiTable(dataKey)) {
      // 多栏商品的第二列有点特殊,都带 _MULTI_SUFFIX 后缀
      let res = columns1
      const colNumber = getMultiNumber(dataKey)
      for (let i = 2; i <= colNumber; i++) {
        const colNum = i > 2 ? i : '' // 栏数
        const columnsI = columns.map((val, index) => {
          const data = {
            ...val,
            index,
            text: val.text.replace(
              /{{(price\()?列\.([^{{]+)}}/g,
              (s, s1, s2) => {
                if (s1) {
                  // 有price函数插进来
                  const mix_suffix = s2.replace(/\*/, () => `${MULTI_SUFFIX}*`)
                  return `{{${s1}列.${mix_suffix}${colNum}}}`
                } else {
                  return `{{列.${s2}${MULTI_SUFFIX}${colNum}}}`
                }
              }
            ) // {{列.xx}} => {{列.xxMULTI_SUFFIXi}}
          }
          // 多栏商品的明细取 __details_MULTI_SUFFIX
          if (val.specialDetailsKey)
            data.specialDetailsKey =
              val.specialDetailsKey + `${MULTI_SUFFIX}${colNum}`
          return data
        })
        res = res.concat(columnsI)
      }
      return res
    } else {
      return columns1
    }
  }

  renderDefault() {
    let {
      config,
      config: { dataKey, arrange, customerRowHeight = 23 },
      name,
      range,
      pageIndex,
      printerStore
    } = this.props

    // 数据
    dataKey = getDataKey(dataKey, arrange)
    const tableData = printerStore.data._table[dataKey] || []

    // 列
    const columns = this.getColumns()
    // 列宽固定(避免跳页bug)
    const thWidths = printerStore.tablesInfo[name]?.head.widths || []
    // 每页合计在前
    const subtotalTrPageSummary = () => {
      return (
        <>
          <SubtotalTr
            range={range}
            config={config}
            printerStore={printerStore}
          />
          <PageSummary {...this.props} />
        </>
      )
    }
    // 合计在前
    const PageSummarySubtotalTr = () => {
      return (
        <>
          <PageSummary {...this.props} />
          <SubtotalTr
            range={range}
            config={config}
            printerStore={printerStore}
          />
        </>
      )
    }
    const getTdStyle = (index, style = {}) => {
      const width = thWidths[index]
      const { fontSize } = style
      let tdStyle = {}
      let minWidth = 24

      if (!width) return tdStyle
      if (fontSize) minWidth = _.parseInt(fontSize) * 2
      if (width >= 150) {
        tdStyle = {
          minWidth: width
        }
      } else {
        tdStyle = {
          minWidth,
          width
        }
      }
      return tdStyle
    }

    return (
      <table
        style={{
          // td会撑开table的宽度
          tableLayout: 'inherit',
          wordBreak: 'break-all'
        }}
      >
        <thead>
          <tr style={{ height: `${customerRowHeight}px` }}>
            {_.map(columns, (col, i) => (
              <th
                key={i}
                data-index={col.index}
                data-name={getTableColumnName(name, col.index)}
                draggable
                style={{
                  ...getTdStyle(i, col.headStyle),
                  ...col.headStyle
                }}
                className={classNames({
                  active:
                    getTableColumnName(name, col.index) ===
                    printerStore.selected
                })}
                onClick={this.handleClick}
                onDragStart={this.handleDragStart}
                onDrop={this.handleDrop}
                onDragOver={this.handleDragOver}
              >
                {col.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(_.range(range.begin, range.end), i => {
            const _special = tableData[i] && tableData[i]._special
            if (_special)
              return <SpecialTr key={i} config={config} data={_special} />
            // 如果项为空对象展现一个占满一行的td
            const isItemNone = !_.keys(tableData[i]).length

            return (
              <tr style={{ height: `${customerRowHeight}px` }} key={i}>
                {isItemNone ? (
                  <td colSpan='99' />
                ) : (
                  _.map(columns, (col, j) => {
                    return (
                      <td
                        key={j}
                        data-name={getTableColumnName(name, col.index)}
                        style={{
                          ...getTdStyle(j, col.style),
                          ...col.style
                        }}
                        className={classNames({
                          active:
                            getTableColumnName(name, col.index) ===
                            printerStore.selected
                        })}
                        dangerouslySetInnerHTML={{
                          __html: col.isSpecialColumn
                            ? printerStore.templateSpecialDetails(
                                col,
                                dataKey,
                                i
                              )
                            : printerStore
                                .templateTable(col.text, dataKey, i, pageIndex)
                                .replace(/\(\)/g, '')
                        }}
                      />
                    )
                  })
                )}
              </tr>
            )
          })}
          {this.props.config.subtotal.isCommutationPlace
            ? PageSummarySubtotalTr()
            : subtotalTrPageSummary()}
        </tbody>
      </table>
    )
  }

  renderEmptyTable() {
    return (
      <table>
        <thead />
        <tbody>
          <tr />
        </tbody>
      </table>
    )
  }

  render() {
    let {
      config: { className, dataKey, arrange },
      name,
      placeholder,
      printerStore
    } = this.props
    dataKey = getDataKey(dataKey, arrange)
    const tableData = printerStore.data._table[dataKey] || []
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
        {tableData.length ? this.renderDefault() : this.renderEmptyTable()}
      </div>
    )
  }
}

Table.propTypes = {
  config: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  range: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  printerStore: PropTypes.object
}

export default Table
