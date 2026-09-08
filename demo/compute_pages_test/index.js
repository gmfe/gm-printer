import React from 'react'
import { computePages } from '../../src'
// 模板配置
import { defaultConfig } from '../delivery_bill/template_config'
// 模拟数据
import deliveryData from '../delivery_bill/mock_data/default_data'
import toKey from '../delivery_bill/data_to_key'

/**
 * 构造测试数据：将主表（orders_category）数据复制 times 份，强制分出多页
 */
const buildData = times => {
  const data = toKey(deliveryData)
  const list = data._table.orders_category
  data._table.orders_category = Array(times)
    .fill(1)
    .reduce(acc => acc.concat(list), [])
  return data
}

/**
 * computePages 验证页：
 * 1. 原始数据（单页情况）
 * 2. ×5 / ×20 复制（多页情况）
 * 输出 pages 切片、remainPageHeight、tableCustomerRowHeight，并与打印分页对照
 */
class ComputePagesTest extends React.Component {
  state = {
    result: null,
    running: false
  }

  // 跑一次 computePages 并展示结果
  handleRun = times => {
    this.setState({ running: true, result: null })
    const data = buildData(times)
    const totalRows = data._table.orders_category.length
    window.console.time('computePages')
    computePages({ data, config: defaultConfig }).then(res => {
      window.console.timeEnd('computePages')
      window.console.log('computePages result:', res)
      this.setState({
        running: false,
        result: { totalRows, ...res }
      })
    })
  }

  render() {
    const { result, running } = this.state

    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => this.handleRun(1)}>原始数据</button>{' '}
        <button onClick={() => this.handleRun(5)}>×5（多页）</button>{' '}
        <button onClick={() => this.handleRun(20)}>×20（多页）</button>
        {running && <p>计算中...</p>}
        {result && (
          <div>
            <p>主表总行数：{result.totalRows}</p>
            <p>页数：{result.pages.length}</p>
            <p>remainPageHeight：{result.remainPageHeight}</p>
            <p>tableCustomerRowHeight：{result.tableCustomerRowHeight}</p>
            <pre style={{ maxHeight: 400, overflow: 'auto' }}>
              {JSON.stringify(result.pages, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }
}

export default ComputePagesTest
