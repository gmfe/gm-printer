import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Flex } from '../components'
import { Gap, Title } from '../common/component'
import editStore from './store'
import { observer, inject } from 'mobx-react'
import EditorTitle from '../common/editor_title'
import EditorSelect from '../common/editor_select'
import EditorField from '../common/editor_edit_field'
import EditorAddField from '../common/editor_add_field'
import ContextMenu from './context_menu'
import i18next from '../../locales'
import withStore from '../common/hoc_with_store'
import { computed } from 'mobx'

const tableDataKeyList = [
  { value: 'orders', text: i18next.t('账单明细') },
  { value: 'skus', text: i18next.t('订单明细') },
  { value: 'merchant', text: i18next.t('商户明细') }
]

@withStore(editStore)
@inject('editStore')
@observer
class Editor extends React.Component {
  @computed get currentFields() {
    const type = editStore.computedTableDataKeyOfSelectedRegion
    const fields = JSON.parse(JSON.stringify(this.props.addFields))
    const tableFields = fields.tableFields
    switch (type) {
      case 'merchant':
        fields.tableFields = {
          [tableFields.merchant.name]: tableFields.merchant.value
        }
        break
      case 'orders':
        fields.tableFields = {
          [tableFields.orders.name]: tableFields.orders.value
        }
        break
      case 'skus':
        fields.tableFields = {
          [tableFields.skus.name]: tableFields.skus.value
        }
        break
      default:
        fields.tableFields = {
          [tableFields.merchant.name]: tableFields.merchant.value,
          [tableFields.orders.name]: tableFields.orders.value,
          [tableFields.skus.name]: tableFields.skus.value
        }
        break
    }
    return fields
  }

  render() {
    const { onSave, showEditor } = this.props

    return (
      <div className='gm-printer-edit'>
        <Flex className='gm-printer-edit-title-fixed'>
          <Title
            title={i18next.t('模板预览')}
            text={
              <span className='gm-text-desc gm-padding-left-5'>
                {i18next.t(
                  '说明：选中内容进行编辑，可拖动字段移动位置，右键使用更多功能'
                )}
              </span>
            }
          />
        </Flex>

        {showEditor && (
          <div className='gm-printer-edit-zone'>
            <EditorTitle onSave={onSave} />
            <Gap height='10px' />
            <EditorSelect />
            <Gap height='5px' />
            <EditorField tableDataKeyList={tableDataKeyList} />
            <Gap height='5px' />
            <EditorAddField addFields={this.currentFields} />

            <div id='gm-printer-tip' />

            <div id='gm-printer-modal' />
          </div>
        )}

        <div className='gm-printer-edit-wrap'>
          <ContextMenu editStore={editStore} mockData={this.props.mockData} />
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  showEditor: PropTypes.bool,
  mockData: PropTypes.object.isRequired,
  addFields: PropTypes.object.isRequired
}

Editor.defaultProps = {
  onSave: _.noop
}

export default Editor
