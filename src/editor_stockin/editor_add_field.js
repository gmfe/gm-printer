import i18next from '../../locales'
import React, { Fragment } from 'react'
import { Flex } from '../components'
import { Gap, SubTitle, Title } from './component'
import _ from 'lodash'
import editStore from './store'
import { observer } from 'mobx-react'

const FieldBtn = ({ name, onClick }) => (
  <Flex alignCenter style={{ width: '50%', margin: '3px 0' }}>
    <span className='gm-printer-edit-plus-btn' onClick={onClick}>
      +
    </span>
    <span className='gm-padding-left-5'>{name}</span>
  </Flex>
)

class FieldList extends React.Component {
  render () {
    const { fields, handleAddField } = this.props
    return (
      <div>
        <Title title={i18next.t('添加字段')}/>
        <Gap/>
        {_.map(fields, (arr, groupName) => {
          return (
            <Fragment key={groupName}>
              <SubTitle text={groupName}/>
              <Flex wrap>
                {_.map(arr, o => <FieldBtn key={o.key} name={o.key} onClick={handleAddField.bind(this, o)}/>)}
              </Flex>
            </Fragment>
          )
        })}
      </div>
    )
  }
}

@observer
class EditorAddField extends React.Component {
  render () {
    const { addFields: { tableFields, commonFields } } = this.props

    let content = null
    if (editStore.selectedRegion === null) {
      content = null
    } else if (editStore.computedRegionIsTable) {
      content = <FieldList fields={tableFields} handleAddField={editStore.addFieldToTable}/>
    } else {
      content = <FieldList fields={commonFields} handleAddField={editStore.addFieldToPanel}/>
    }

    return <div className='gm-overflow-y'>{content}</div>
  }
}

export default EditorAddField
