import i18next from '../../locales'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Flex, Switch } from '../components'
import { Text } from './component'

@inject('editStore')
@observer
class EditorCutomizedConfig extends React.Component {
  handleAutoFilling = value => {
    const { editStore } = this.props
    if (!value) {
      editStore.setFillIndex(false)
    }
    editStore.handleChangeTableData(value)
  }

  handleMultiDigitDecimal = value => {
    const { editStore } = this.props
    editStore.setMultiDigitDecimal(value)
  }

  handleFillIndex = value => {
    const { editStore } = this.props
    editStore.setFillIndex(value)
  }

  handleTaxFreeProductRateDisplay = e => {
    const value = e.target.value
    console.log(value)

    const { editStore } = this.props
    // 限制10位以内，如果超过则截断
    const trimmedValue = value.length > 10 ? value.slice(0, 10) : value
    editStore.setTaxFreeProductRateDisplay(trimmedValue)
  }

  render() {
    const {
      editStore,
      editStore: {
        isAutoFilling,
        isMultiDigitDecimal,
        fillIndex,
        taxFreeProductRateDisplay
      }
    } = this.props
    // 是table
    if (editStore.computedRegionIsTable) {
      return (
        <>
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('行数是否自动填充')}：</div>
            <Switch checked={isAutoFilling} onChange={this.handleAutoFilling} />
          </Flex>

          {isAutoFilling && (
            <Flex className='gm-padding-top-5 '>
              <div>{i18next.t('空白行是否填充序号')}：</div>
              <Switch
                checked={fillIndex || false}
                onChange={this.handleFillIndex}
              />
            </Flex>
          )}
          <Flex className='gm-padding-top-5 gm-text-red' column>
            {i18next.t('注意：填充仅支持单栏数据使用')}
          </Flex>
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('是否开启多位小数2')}：</div>
            <Switch
              checked={isMultiDigitDecimal}
              onChange={this.handleMultiDigitDecimal}
            />
          </Flex>
          <Flex alignCenter className='gm-padding-top-5'>
            <div>{i18next.t('免税产品税率显示')}：</div>
            <Text
              value={taxFreeProductRateDisplay || ''}
              onChange={this.handleTaxFreeProductRateDisplay}
              placeholder={i18next.t('请输入')}
              maxLength={10}
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
