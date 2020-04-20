import React from 'react'
import { Flex } from '../components'
import PropTypes from 'prop-types'
import { Gap, Title } from '../common/component'
import i18next from '../../locales'
import { observer, inject } from 'mobx-react'
import EditorTitle from '../common/editor_title'
import EditorSelect from '../common/editor_select'
import EditorField from '../common/editor_edit_field'
import EditorAddField from '../common/editor_add_field'
import withStore from '../common/hoc_with_store'
import editStore from './store'
import ContextMunu from './context_menu'

@withStore(editStore)
@inject('editStore')
@observer
class Editor extends React.Component {
  render() {
    const { onSave, showEditor, addFields } = this.props
    return (
      <div className='gm-printer-edit'>
        <Flex>
          <Title
            title={i18next.t('模板预览')}
            text={
              <span className='gm-text-desc gm-padding-left-5'>
                {i18next.t(
                  '说明：单击选中内容，双击编辑，可拖动以摆放位置，可方向键细调位置，可点击右键删除'
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
            <EditorField />
            <Gap height='5px' />
            <EditorAddField addFields={addFields} />

            <div id='gm-printer-tip' />
            <div id='gm-printer-modal' />
          </div>
        )}

        <div className='gm-printer-edit-wrap'>
          <ContextMunu />
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  config: PropTypes.object.isRequired,
  showEditor: PropTypes.bool,
  onSave: PropTypes.func,
  addFields: PropTypes.object.isRequired,
  mockData: PropTypes.object.isRequired
}

export default Editor
