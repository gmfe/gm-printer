import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Gap, Title } from './component'
import { Flex } from '../components'

@inject('editStore')
@observer
class EditorPageBorder extends React.Component {
  handleSelect = id => {
    this.props.editStore.setPageBorderId(id)
  }

  render() {
    const { editStore } = this.props
    const savedBorder = editStore.config.page?.border
    const selectedId = savedBorder?.id || editStore.config.page?.borderId
    const list = editStore.computedAvailablePageBorders

    return (
      <div>
        <Title title={i18next.t('编辑边框')} />
        <Gap />
        {!list.length ? (
          <div className='gm-text-desc'>{i18next.t('暂无可用边框')}</div>
        ) : (
          <Flex wrap>
            {list.map(item => {
              const active = selectedId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => this.handleSelect(item.id)}
                  style={{
                    width: 88,
                    margin: '0 8px 8px 0',
                    padding: 4,
                    cursor: 'pointer',
                    border: active ? '2px solid #56a3f2' : '1px solid #eee',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: 64,
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                  <div style={{ marginTop: 4, fontSize: 12 }}>{item.name}</div>
                </div>
              )
            })}
            <div
              onClick={() => this.handleSelect(null)}
              style={{
                width: 88,
                margin: '0 8px 8px 0',
                padding: 4,
                cursor: 'pointer',
                border: !selectedId ? '2px solid #56a3f2' : '1px dashed #ccc',
                textAlign: 'center',
                lineHeight: '64px',
                fontSize: 12,
                color: '#999'
              }}
            >
              {i18next.t('无边框')}
            </div>
          </Flex>
        )}
      </div>
    )
  }
}

EditorPageBorder.propTypes = {
  editStore: PropTypes.object
}

export default EditorPageBorder
