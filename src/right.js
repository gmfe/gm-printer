import React from 'react'
import PropTypes from 'prop-types'
import { PanelBlock, PanelColumns, PanelPage } from './panel'

class Right extends React.Component {
  handleUpdate = (key, data) => {
    const {config, onUpdate} = this.props

    onUpdate({
      ...config,
      [key]: data
    })
  }

  render () {
    const {config} = this.props

    return (
      <div>
        <PanelPage
          title='纸张'
          data={config.page}
          onUpdate={this.handleUpdate.bind(this, 'page')}
        />
        <PanelBlock
          title='页眉'
          addTypes={['line']}
          data={config.header}
          onUpdate={this.handleUpdate.bind(this, 'header')}
        />
        <PanelBlock
          title='头部'
          addTypes={['line']}
          data={config.top}
          onUpdate={this.handleUpdate.bind(this, 'top')}
        />
        <PanelColumns
          title='表格数据'
          data={config.table}
          onUpdate={this.handleUpdate.bind(this, 'table')}
        />
        <PanelBlock
          title='底部'
          addTypes={['line']}
          data={config.bottom}
          onUpdate={this.handleUpdate.bind(this, 'bottom')}
        />
        <PanelBlock
          title='页脚'
          addTypes={['line']}
          data={config.footer}
          onUpdate={this.handleUpdate.bind(this, 'footer')}
        />
        <PanelBlock
          title='任意位置'
          addTypes={['image']}
          data={config.fixed}
          onUpdate={this.handleUpdate.bind(this, 'fixed')}
        />
      </div>
    )
  }
}

Right.propTypes = {
  config: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
}

Right.deaultProps = {}

export default Right
