import React from 'react'
import { EditorStockOut } from '../../src'
// 模板配置
import config from './template_config/default_config'
// 模拟数据
import data from './mock_data/default_data'
import formatData from './data_to_key'
// 添加的字段
import addFields from './add_fields'

const StockOutEditor = ({ handleSave }) => (
  <EditorStockOut
    config={config}
    mockData={formatData(data)}
    onSave={handleSave}
    showEditor
    addFields={addFields}
  />
)

export default StockOutEditor
