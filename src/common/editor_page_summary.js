import React from 'react'
import { Fonter, Gap, Separator, TextAlign, Title } from './component'
import i18next from '../../locales'
import _ from 'lodash'
import { has } from 'mobx'
import { Flex, Switch } from '../components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

@inject('editStore')
@observer
class SummarySetting extends React.Component {
  setSummaryConfig = obj => {
    this.props.editStore.setSummaryConfig(obj)
  }

  handlePageSummaryShow = pageSummaryShow => {
    this.setSummaryConfig({ pageSummaryShow })
  }

  handleStyle = style => {
    this.setSummaryConfig({ style })
  }

  handlePageSummaryColumns = e => {
    const { editStore } = this.props
    const { summaryConfig } = editStore.computedTableSpecialConfig
    // 由于初始模板没有summary 这个object，为了UI响应数据，只能这么写了
    const hasSummaryConfig = has(
      editStore.computedTableSpecialConfig,
      'summaryConfig'
    )
    const oldSummaryColumns =
      (hasSummaryConfig && summaryConfig.summaryColumns.slice()) || []

    const id = e.target.id
    const newSummaryColumns = _.xor(oldSummaryColumns, [id])

    this.setSummaryConfig({ summaryColumns: newSummaryColumns })
  }

  render() {
    const { editStore, summaryFields } = this.props
    const { summaryConfig } = editStore.computedTableSpecialConfig

    // 由于初始末班没有summary 这个object，为了UI响应数据，只能这么写了
    const hasSummaryConfig = has(
      editStore.computedTableSpecialConfig,
      'summaryConfig'
    )
    const summaryStyle = (hasSummaryConfig && summaryConfig.style) || {}
    const summaryColumns =
      (hasSummaryConfig && summaryConfig.summaryColumns) || []

    const pageSummaryShow =
      (hasSummaryConfig && summaryConfig.pageSummaryShow) || false

    return (
      <div>
        <Title title={i18next.t('合计汇总')} />
        <Gap />

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('每页合计')}：</div>
          <Switch
            checked={pageSummaryShow}
            onChange={this.handlePageSummaryShow}
          />
        </Flex>

        <Flex className='gm-padding-top-5'>
          <Flex>样式设置：</Flex>
          <Fonter style={summaryStyle} onChange={this.handleStyle} />
          <Separator />
          <TextAlign style={summaryStyle} onChange={this.handleStyle} />
        </Flex>

        <div className='gm-padding-top-5'>
          <div>汇总字段：</div>
          <Flex wrap>
            {summaryFields.map(o => (
              <label htmlFor={o.value} style={{ width: '50%' }} key={o.value}>
                <input
                  type='checkbox'
                  id={o.value}
                  checked={summaryColumns.includes(o.value)}
                  onChange={this.handlePageSummaryColumns}
                />
                &nbsp;{o.key}
              </label>
            ))}
          </Flex>
        </div>
      </div>
    )
  }
}

SummarySetting.propTypes = {
  editStore: PropTypes.object,
  summaryFields: PropTypes.array.isRequired
}

@inject('editStore')
@observer
class EditorSummary extends React.Component {
  render() {
    const { editStore, summaryFields } = this.props
    if (editStore.computedRegionIsTable) {
      return <SummarySetting summaryFields={summaryFields} />
    } else {
      return null
    }
  }
}

EditorSummary.propTypes = {
  editStore: PropTypes.object,
  summaryFields: PropTypes.array.isRequired
}

export default EditorSummary
