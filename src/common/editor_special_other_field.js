import React from 'react'
import PropTypes from 'prop-types'
import { Gap, Checkbox } from './component'
import { observer, inject } from 'mobx-react'

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
