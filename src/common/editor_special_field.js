import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import { Gap, RadioGap, Title, Radio } from './component'
import { observer, inject } from 'mobx-react'

@inject('editStore')
@observer
class SpecialField extends React.Component {
  render() {
    const { addFields, mockData, editStore } = this.props
    const specialFields = addFields.specialFields
    const tableData = mockData?._table

    return (
      <div>
        <Title title={i18next.t('配送单特殊控制')} />
        <RadioGap />
        {specialFields &&
          specialFields.map(fields => (
            <Radio
              id={fields.id}
              value={fields.value}
              key={fields.id}
              checked={editStore.config.specialConfig === fields.id}
              radioChecked={() => editStore.radioChecked(fields, tableData)}
            />
          ))}
        <Gap />
      </div>
    )
  }
}

SpecialField.propTypes = {
  addFields: PropTypes.object.isRequired,
  editStore: PropTypes.object,
  mockData: PropTypes.object.isRequired
}

export default SpecialField
