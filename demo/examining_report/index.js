import React from 'react'
import { EditorExaminingReport } from '../../src'
import config from './template_config/default_config'
import data from './mock_data/default_data'
import formatData from './data_to_key'
import addFields from './add_fields'

const ExaminingReportEditorDemo = ({ handleSave }) => (
  <EditorExaminingReport
    config={config}
    mockData={formatData(data)}
    onSave={handleSave}
    showEditor
    addFields={addFields}
    menuConfig={['multi']}
  />
)

export default ExaminingReportEditorDemo
