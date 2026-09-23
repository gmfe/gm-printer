import React from 'react'
import PropTypes from 'prop-types'
import { Editor, imageConfigDelivery } from '../../src'
// 模板配置
import { defaultConfig } from './template_config' // 配送单
// 模拟数据
import deliveryData from './mock_data/default_data'
import toKey from './data_to_key'
// 添加的字段
import DeliveryAddFields from './add_fields'

const DeliveryEditor = ({ handleSave }) => (
  <Editor
    config={defaultConfig}
    mockData={toKey(deliveryData)}
    onSave={handleSave}
    showEditor
    mergeClassificationAndLabel
    addFields={DeliveryAddFields}
    imageConfig={imageConfigDelivery}
  />
)

DeliveryEditor.propTypes = {
  handleSave: PropTypes.func
}

export default DeliveryEditor
