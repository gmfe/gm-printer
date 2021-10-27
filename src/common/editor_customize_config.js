import i18next from '../../locales'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Flex, Switch } from '../components'

@inject('editStore')
@observer
class EditorCutomizedConfig extends React.Component {
  handleAutoFilling = value => {
    const { editStore } = this.props
    editStore.handleChangeTableData(value)
  }

  render() {
    /** ！！！注： 不要删除config, 否则会影响mobx的动态监听（PS： 感觉像是mobx的bug？） */
    const {
      editStore,
      editStore: { config }
    } = this.props
    const {
      extraSpecialConfig,
      specialConfig
    } = editStore.computedTableSpecialConfig
    // 是table且具有specialConfig的附属table
    if (editStore.computedRegionIsTable && !specialConfig) {
      return (
        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('行数是否自动填充')}：</div>
          <Switch
            checked={extraSpecialConfig?.isAutoFilling}
            onChange={this.handleAutoFilling}
          />
        </Flex>
      )
    } else {
      return null
    }
  }
}

EditorCutomizedConfig.propTypes = {
  editStore: PropTypes.object,
  extraSpecialConfig: PropTypes.object
}

export default EditorCutomizedConfig
