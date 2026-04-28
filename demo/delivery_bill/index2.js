import React from 'react'
import { Editor2 } from '../../src'
// 模板配置
import { defaultConfig } from './template_config' // 配送单
// 模拟数据
import deliveryData from './mock_data/default_data'
import toKey from './data_to_key'
// 添加的字段
import DeliveryAddFields from './add_fields'

const DeliveryEditor = ({ handleSave }) => (
  <Editor2
    config={defaultConfig}
    mockData={toKey(deliveryData)}
    onSave={handleSave}
    showEditor
    mergeClassificationAndLabel
    addFields={DeliveryAddFields}
    // menuConfig={{
    //   multi: true
    // }}
    menuConfig={['multi']}
  />
)

export default DeliveryEditor
