import React from 'react'
import { Flex } from 'react-gm'
import PropTypes from 'prop-types'
import { toKey } from '../printer/key'
import _ from 'lodash'
import editStore from './store'
import { observer } from 'mobx-react'

const FieldBtn = ({ name, onClick }) => (
  <Flex alignCenter justifyBetween style={{ width: '50%', padding: '2px 8px 2px 0px' }}>
    <span>{name}</span>
    <button className='btn-primary btn btn-xs' style={{ borderRadius: '4px' }} onClick={onClick}>
      <i className='xfont xfont-plus gm-font-12'/>
    </button>
  </Flex>
)

@observer
class OrderField extends React.Component {
  handleAddOrderField (field) {

  }

  render () {
    const { order } = this.props

    return (
      <div>
        <Flex alignCenter>
          <i className='xfont xfont-bill' style={{ color: 'rgb(253, 82, 113)' }}/>添加字段
        </Flex>

        <div className='gm-bg-info'>订单信息:</div>
        <Flex wrap>
          {_.map(order, (v, key) => <FieldBtn name={key} key={key}
            onClick={this.handleAddOrderField.bind(this, key)}/>)}
        </Flex>
      </div>
    )
  }
}

@observer
class TableField extends React.Component {
  handleAddTableColumn (field) {
    editStore.addTableColumn(undefined, field)
  }

  render () {
    const { orders, abnormal } = this.props._table
    return (
      <div>
        <Flex alignCenter>
          <i className='xfont xfont-bill' style={{ color: 'rgb(253, 82, 113)' }}/>添加字段
        </Flex>

        <div className='gm-bg-info'>商品表格:</div>
        <Flex wrap>
          {_.map(orders[0], (v, key) => {
            if (key !== '_origin') {
              return <FieldBtn name={key} key={key}
                onClick={this.handleAddTableColumn.bind(this, key)}/>
            }
          })}
        </Flex>

        <div className='gm-bg-info'>异常表格:</div>
        <Flex wrap>
          {_.map(abnormal[0], (v, key) => {
            if (key !== '_origin') {
              return <FieldBtn name={key} key={key}
                onClick={this.handleAddTableColumn.bind(this, key)}/>
            }
          })}</Flex>
      </div>
    )
  }
}

@observer
class EditorAddField extends React.Component {
  render () {
    const newData = toKey(this.props.data)
    // eslint-disable-next-line
    const {_counter, _origin, _table, ...order} = newData
    console.log(newData)

    let content = null
    if (editStore.computedIsSelectBlock) {
      content = <OrderField order={order}/>
    } else if (editStore.computedIsSelectTable) {
      content = <TableField _table={_table}/>
    }
    return <div className='gm-padding-10 gm-overflow-y'>{content}</div>
  }
}

EditorAddField.propTypes = {
  data: PropTypes.object
}

export default EditorAddField
