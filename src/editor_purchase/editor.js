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
import EditorSpecialTable from './editor_special_table'
import ContextMenu from './context_menu'
import i18next from '../../locales'
import withStore from '../common/hoc_with_store'

@withStore(editStore)
@inject('editStore')
@observer
class Editor extends React.Component {
  render() {
    const { onSave, showEditor, addFields, isPurchase } = this.props

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
            <EditorTitle onSave={onSave} isPurchase={isPurchase} />
            <Gap height='10px' />
            <EditorSelect isPurchase={isPurchase} />
            <Gap height='5px' />
            <EditorField />
            <Gap height='5px' />
            <EditorAddField addFields={addFields} />
            <Gap height='5px' />
            <EditorSpecialTable addFields={addFields} />

            <div id='gm-printer-tip' />

            <div id='gm-printer-modal' />
          </div>
        )}

        <div className='gm-printer-edit-wrap'>
          <ContextMenu />
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
  addFields: PropTypes.object.isRequired,
  isPurchase: PropTypes.bool
}

Editor.deaultProps = {
  onSave: _.noop,
  isPurchase: false
}

export default Editor
