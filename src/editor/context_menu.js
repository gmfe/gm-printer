import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import CommonContextMenu from '../common/common_context_menu'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'
import { Printer } from '../printer'

const blockTypeList = [
  { value: '', text: i18next.t('插入文本') },
  { value: 'line', text: i18next.t('插入线条') },
  { value: 'image', text: i18next.t('插入图片') },
  { value: 'counter', text: i18next.t('插入分类汇总') },
  { value: 'barcode', text: i18next.t('插入订单条形码') },
  { value: 'qrcode', text: i18next.t('插入订单溯源二维码') },
  {
    value: 'uniform_social_credit_code',
    text: i18next.t('插入苏州安全监管平台二维码')
  }
]

@inject('editStore')
@observer
class ContextMenu extends React.Component {
  componentDidMount() {
    const {
      editStore,
      editStore: {
        config: { autoFillConfig, specialControlConfig }
      }
    } = this.props

    if (autoFillConfig?.checked) {
      editStore.handleChangeTableData(
        autoFillConfig?.checked,
        autoFillConfig?.dataKey
      )
    }
    /** 初始化特殊控制的配置 */
    if (specialControlConfig?.multiDigitDecimal) {
      // 多位小数
      editStore.setMultiDigitDecimal(specialControlConfig?.multiDigitDecimal)
    }
  }

  /**
   * 是否存在每页合计按钮,非异常明细才有按钮
   * @param name => ContextMenu 的 this.state.name
   * @return {boolean}
   */
  hasSubtotalBtn = name => {
    if (!name) return false
    const noSubtotalList = ['abnormal', 'abnormalDetails']
    const arr = name.split('.')
    if (_.includes(arr, 'table')) {
      const dataKey = this.props.editStore.config.contents[arr[2]].dataKey
      return !_.includes(noSubtotalList, dataKey)
    }
  }

  handleChangeTableDataKey = (key, name) => {
    const { editStore } = this.props

    editStore.changeTableDataKey(name, key)
  }

  handleSubtotal = name => {
    const { editStore } = this.props
    editStore.setSubtotalShow(name)
  }

  handleChangeTableData = isAutoFilling => {
    const { editStore } = this.props
    editStore.handleChangeTableData(isAutoFilling)
  }

  handleOverallOrder = name => {
    const { editStore } = this.props
    editStore.setOverallOrderShow(name)
  }

  renderOrderActionBtn = name => {
    if (!this.hasSubtotalBtn(name)) {
      return null
    }

    const {
      editStore: {
        config: {
          page: { type }
        },
        isAutoFilling
      }
    } = this.props
    const arr = name.split('.')
    const {
      dataKey,
      subtotal,
      overallOrder
    } = this.props.editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')

    const isMultiActive = keyArr.includes('multi')
    const isThreeActive = keyArr.includes('multi3')
    const isCategoryActive = keyArr.includes('category')
    const isSubtotalActive = subtotal.show
    const isOverallOrder = overallOrder?.show
    console.log('name', name)
    return (
      <>
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'multi', name)}
          className={isMultiActive ? 'active' : ''}
        >
          {i18next.t('双栏商品')}
        </div>
        {/* 三分纸高度太小，做不了三栏，会死循环 */}
        {type !== 'A4/3' && (
          <div
            onClick={this.handleChangeTableDataKey.bind(this, 'multi3', name)}
            className={isThreeActive ? 'active' : ''}
          >
            {i18next.t('三栏商品')}
          </div>
        )}
        <div
          onClick={this.handleChangeTableDataKey.bind(this, 'category', name)}
          className={isCategoryActive ? 'active' : ''}
        >
          {i18next.t('商品分类')}
        </div>
        <div
          onClick={this.handleSubtotal.bind(this, name)}
          className={isSubtotalActive ? 'active' : ''}
        >
          {i18next.t('每页合计')}
        </div>
        <div
          onClick={this.handleChangeTableData.bind(this, !isAutoFilling)}
          className={isAutoFilling ? 'active' : ''}
        >
          {i18next.t('行数填充')}
        </div>
        <div
          onClick={this.handleOverallOrder.bind(this, name)}
          className={isOverallOrder ? 'active' : ''}
        >
          {i18next.t('整单合计')}
        </div>
      </>
    )
  }

  render() {
    const { editStore } = this.props
    return (
      <CommonContextMenu
        renderTableAction={this.renderOrderActionBtn}
        insertBlockList={blockTypeList}
      >
        <Printer
          key={editStore.computedPrinterKey}
          selected={editStore.selected}
          selectedRegion={editStore.selectedRegion}
          isAutoFilling={editStore.isAutoFilling}
          lineheight={editStore.computedTableCustomerRowHeight}
          config={editStore.config}
          data={editStore.mockData}
          getremainpageHeight={editStore.setRemainPageHeight}
          overallorder={editStore.overallOrderShow}
        />
      </CommonContextMenu>
    )
  }
}
ContextMenu.propTypes = {
  editStore: PropTypes.object,
  mockData: PropTypes.object
}
export default ContextMenu
