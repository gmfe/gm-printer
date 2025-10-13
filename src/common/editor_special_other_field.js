import React from 'react'
import PropTypes from 'prop-types'
import { Gap, RadioGap, Title, Checkbox } from './component'
import { observer, inject } from 'mobx-react'
import i18next from '../../locales'

@inject('editStore')
@observer
class SpecialOtherField extends React.Component {
  render() {
    const { addFields, mockData, editStore } = this.props
    const specialOtherFields = addFields.specialOtherFields
    const tableData = mockData?._table
    const checked = editStore?.config?.specialOtherConfig || []
    const specialConfig = editStore?.config?.specialConfig
    return (
      <div>
        <Title title={i18next.t('配送单数据过滤')} />
        <RadioGap />
        {specialOtherFields &&
          specialOtherFields.map(fields => (
            <Checkbox
              id={fields.id}
              value={fields.value}
              key={fields.id}
              checked={checked.includes(fields.id)}
              radioChecked={() =>
                editStore.multipleRadioChecked(fields, tableData)
              }
            />
          ))}

        <Gap />
      </div>
    )
  }
}

SpecialOtherField.propTypes = {
  fields: PropTypes.object,
  handleAddField: PropTypes.func,
  addFields: PropTypes.object.isRequired,
  editStore: PropTypes.object,
  mockData: PropTypes.object.isRequired
}

export default SpecialOtherField
