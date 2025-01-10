import i18next from '../../locales'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Flex, Switch, Select, Option } from '../components'
import _ from 'lodash'

const initOptionsList = [
  { name: i18next.t('自适应'), value: 0 },
  { name: i18next.t('20行'), value: 20 },
  { name: i18next.t('30行'), value: 30 },
  { name: i18next.t('40行'), value: 40 }
]

@inject('editStore')
@observer
class EditorCutomizedConfig extends React.Component {
  handleAutoFilling = value => {
    const { editStore } = this.props
    editStore.setFillRowValue(0)
    if (!value) {
      editStore.setFillIndex(false)
    }
    editStore.handleChangeTableData(value)
  }

  handleMultiDigitDecimal = value => {
    const { editStore } = this.props
    editStore.setMultiDigitDecimal(value)
  }

  handleFillRowValue = value => {
    const { editStore } = this.props
    editStore.setFillRowValue(value)
    editStore.handleChangeTableData(true)
  }

  handleFillIndex = value => {
    const { editStore } = this.props
    editStore.setFillIndex(value)
  }

  render() {
    const {
      editStore,
      editStore: { isAutoFilling, isMultiDigitDecimal, fillRowValue, fillIndex }
    } = this.props
    // 是table
    if (editStore.computedRegionIsTable) {
      return (
        <>
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('行数是否自动填充')}：</div>
            <Switch checked={isAutoFilling} onChange={this.handleAutoFilling} />
            {isAutoFilling && (
              <Select
                value={fillRowValue}
                onChange={this.handleFillRowValue}
                options={initOptionsList}
              >
                {_.map(initOptionsList, (v, k) => (
                  <Option key={k} value={v.value}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            )}
          </Flex>

          <Flex className='gm-padding-top-5 '>
            <div>{i18next.t('行数是否空白行是否填充序号')}：</div>
            <Switch
              checked={fillIndex || false}
              onChange={this.handleFillIndex}
            />
          </Flex>

          <Flex className='gm-padding-top-5 gm-text-red' column>
            {i18next.t('注意：填充仅支持单栏数据使用')}
          </Flex>
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('是否开启多位小数')}：</div>
            <Switch
              checked={isMultiDigitDecimal}
              onChange={this.handleMultiDigitDecimal}
            />
          </Flex>
        </>
      )
    } else {
      return null
    }
  }
}

EditorCutomizedConfig.propTypes = {
  editStore: PropTypes.object,
  extraSpecialConfig: PropTypes.object
}

export default EditorCutomizedConfig
