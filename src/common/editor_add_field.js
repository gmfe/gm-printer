import i18next from '../../locales'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Flex } from '../components'
import { Gap, SubTitle, Title, FieldBtn } from '../common/component'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'

class FieldList extends React.Component {
  render() {
    const { fields, handleAddField } = this.props
    return (
      <div>
        <Title title={i18next.t('添加字段')} />
        <Gap />
        {_.map(fields, (arr, groupName) => {
          return (
            <Fragment key={groupName}>
              <SubTitle text={groupName} />
              <Flex wrap>
                {_.map(arr, o => (
                  <FieldBtn
                    key={o.key}
                    name={o.key}
                    onClick={handleAddField.bind(this, o)}
                  />
                ))}
              </Flex>
            </Fragment>
          )
        })}
      </div>
    )
  }
}

FieldList.propTypes = {
  fields: PropTypes.object.isRequired,
  handleAddField: PropTypes.func
}

@inject('editStore')
@observer
class EditorAddField extends React.Component {
  render() {
    const {
      addFields: { tableFields, commonFields },
      editStore
    } = this.props

    let content = null
    if (editStore.selectedRegion === null) {
      content = null
    } else if (editStore.computedRegionIsTable) {
      content = (
        <FieldList
          fields={tableFields}
          handleAddField={editStore.addFieldToTable}
        />
      )
    } else {
      content = (
        <FieldList
          fields={commonFields}
          handleAddField={editStore.addFieldToPanel}
        />
      )
    }

    return <div className='gm-overflow-y'>{content}</div>
  }
}

EditorAddField.propTypes = {
  addFields: PropTypes.object.isRequired,
  editStore: PropTypes.object
}

export default EditorAddField
