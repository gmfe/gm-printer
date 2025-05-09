import i18next from '../../locales'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Flex, Switch } from '../components'

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

  render() {
    const {
      editStore,
      editStore: { isAutoFilling, isMultiDigitDecimal, fillIndex }
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
