import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

const CategoryTr = props => {
  const {
    config: { categoryConfig },
    data
  } = props
  return (
    <tr>
      <td colSpan='99'>
        <div style={{ ...categoryConfig?.style }}>{data?.text ?? ''}</div>
      </td>
    </tr>
  )
}
CategoryTr.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.object
}

export default observer(CategoryTr)
