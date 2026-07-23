import React from 'react'
import { Editor } from '../../src'
// 模板配置
import { defaultConfig } from './template_config' // 配送单
// 模拟数据
import deliveryData from './mock_data/default_data'
import toKey from './data_to_key'
// 添加的字段
import DeliveryAddFields from './add_fields'
import pageBorderTypes from './page_border_types'

const DeliveryEditor = ({ handleSave }) => (
  <Editor
    enablePageBorder
    pageBorderTypes={pageBorderTypes}
    config={defaultConfig}
    mockData={toKey(deliveryData)}
    onSave={handleSave}
    showEditor
    mergeClassificationAndLabel
    addFields={DeliveryAddFields}
  />
)

export default DeliveryEditor
