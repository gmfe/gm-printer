import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {
  Flex,
  DropDown,
  DropDownItem,
  DropDownItems,
  Dialog
} from '../components'
import { doPrint } from '../printer'
import { toJS } from 'mobx'
import { Title } from '../common/component'

const DialogChildren = observer(props => {
  const {
    editStore: {
      config: { name }
    }
  } = props

  const handleConfigName = e => {
    props.editStore.setConfigName(e.target.value)
  }

  return (
    <Flex alignCenter>
      <div>{i18next.t('模板名称')}：</div>
      <input
        className='gm-printer-edit-input-custom'
        type='text'
        value={name}
        onChange={handleConfigName}
      />
    </Flex>
  )
})

@inject(stores => ({
  editStore: stores.editStore,
  mockData: stores.mockData
}))
@observer
class EditorTitle extends React.Component {
  handleSave = () => {
    const { editStore, isPurchase } = this.props
    const result = editStore.config
    if (!isPurchase && result.batchPrintConfig) {
      delete result.batchPrintConfig
    }
    this.props.onSave(toJS(result))
  }

  handleReset = () => {
    const { editStore, mockData } = this.props
    // 重置模板配置,但是保留原来模板名字
    const config = {
      ...editStore.originConfig,
      __key__: Date.now(), // 时间戳的key,直接让页面重新渲染!
      name: editStore.config.name
    }
    editStore.init(config, mockData)
  }

  handleTestPrint = () => {
    const { mockData, editStore } = this.props
    doPrint(
      {
        config: toJS(editStore.config),
        data: mockData
      },
      true
    )
  }

  handleSaveAs = () => {
    const { editStore } = this.props

    Dialog.render({
      title: i18next.t('另存为'),
      children: <DialogChildren editStore={editStore} />,
      onOK: () => {
        this.props.onSave(toJS(editStore.config), true)
      }
    })
  }

  render() {
    return (
      <Flex justifyBetween>
        <Title title={i18next.t('基本信息')} />
        <div>
          <button
            className='btn btn-default btn-sm'
            onClick={this.handleTestPrint}
          >
            {i18next.t('测试打印')}
          </button>
          <div className='gm-gap-10' />
          <button className='btn btn-default btn-sm' onClick={this.handleReset}>
            {i18next.t('重置')}
          </button>
          <div className='gm-gap-10' />
          <DropDown
            popup={
              <DropDownItems>
                <DropDownItem onClick={this.handleSaveAs}>
                  {i18next.t('另存为')}
                </DropDownItem>
              </DropDownItems>
            }
          >
            <button
              className='btn btn-primary btn-sm'
              onClick={this.handleSave}
            >
              {i18next.t('保存')}
            </button>
          </DropDown>
        </div>
      </Flex>
    )
  }
}

EditorTitle.propTypes = {
  onSave: PropTypes.func.isRequired,
  isPurchase: PropTypes.bool
}
EditorTitle.deaultProps = {
  isPurchase: false
}

EditorTitle.wrappedComponent.propTypes = {
  mockData: PropTypes.object.isRequired
}

export default EditorTitle
