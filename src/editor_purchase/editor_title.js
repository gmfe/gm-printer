import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { observer } from 'mobx-react'
import { Flex } from '../components'
import { doPrint } from '../printer'
import { toJS } from 'mobx'
import { Title } from './component'

@observer
class EditorTitle extends React.Component {
  handleReset = () => {
    // 重置模板配置,但是保留原来模板名字
    const config = {
      ...editStore.originConfig,
      name: editStore.config.name
    }
    editStore.init(config)
  }

  handleTestPrint = () => {
    const { data } = this.props
    doPrint({
      config: toJS(editStore.config),
      data
    }, true)
  }

  render () {
    return (
      <Flex justifyBetween>
        <Title title={i18next.t('基本信息')}/>
        <div>
          <button className='btn btn-default btn-sm' onClick={this.handleTestPrint}>{i18next.t('测试打印')}
          </button>
          <div className='gm-gap-10'/>
          <button className='btn btn-default btn-sm' onClick={this.handleReset}>{i18next.t('重置')}
          </button>
          <div className='gm-gap-10'/>
          <button className='btn btn-primary btn-sm' onClick={this.props.onSave}>{i18next.t('保存')}</button>
        </div>
      </Flex>
    )
  }
}

EditorTitle.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditorTitle
